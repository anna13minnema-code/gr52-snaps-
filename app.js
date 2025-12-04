// CONFIG — remplace par tes infos Supabase
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM
const camera = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const captureBtn = document.getElementById('captureBtn');
const gallery = document.getElementById('gallery');
const stepTitle = document.getElementById('stepTitle');
const stepDesc = document.getElementById('stepDesc');

// determine step from query param (etape.html?step=1)
function getStepFromQuery() {
  const q = new URLSearchParams(window.location.search);
  const s = q.get('step') || '1';
  const n = Math.min(5, Math.max(1, parseInt(s, 10)||1));
  return n;
}
const STEP = getStepFromQuery();
const BUCKET = `etape${STEP}`;

// update UI texts
if (stepTitle) stepTitle.textContent = `Étape ${STEP}`;
if (stepDesc) stepDesc.textContent = `Galerie de l'étape ${STEP} — trépied n°${STEP}.`;

// Camera start
takePhotoBtn && takePhotoBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }});
    camera.srcObject = stream;
    camera.style.display = 'block';
    captureBtn.style.display = 'inline-block';
  } catch (e) {
    alert('Impossible d’accéder à la caméra : ' + e.message);
  }
});

// Capture & upload
captureBtn && captureBtn.addEventListener('click', async () => {
  const ctx = canvas.getContext('2d');
  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;
  ctx.drawImage(camera, 0, 0);
  canvas.toBlob(async (blob) => {
    const fileName = `photo_${Date.now()}.jpg`;
    // Upload to bucket etapeN
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (error) {
      console.error('Upload error', error);
      alert('Échec de l’upload : ' + error.message);
      return;
    }
    // refresh gallery
    await loadImages();
  }, 'image/jpeg', 0.9);
});

// Load images from bucket and sort by filename desc (newest first)
async function loadImages(){
  if (!gallery) return;
  gallery.innerHTML = 'Chargement...';

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 100 });

  if (error) {
    gallery.innerHTML = '<p>Impossible de récupérer les images.</p>';
    console.error(error);
    return;
  }

  // sort by name descending (photo_ timestamp -> lexicographic = chronological)
  data.sort((a,b) => (b.name > a.name ? 1 : -1));

  gallery.innerHTML = '';
  data.forEach(item => {
    // public URL pattern
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(item.name)}`;
    const img = document.createElement('img');
    img.src = url;
    img.alt = `${BUCKET} / ${item.name}`;
    gallery.appendChild(img);
  });
}

// initial load
loadImages();
