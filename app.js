// --- INITIALISATION SUPABASE ---
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ELEMENTS DOM ---
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const takePhotoBtn = document.getElementById("takePhotoBtn");
const captureBtn = document.getElementById("captureBtn");
const gallery = document.getElementById("gallery");

// --- DEMARRER LA CAMERA ---
takePhotoBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  camera.srcObject = stream;

  camera.style.display = "block";
  captureBtn.style.display = "inline-block";
});

// --- CAPTURER ET UPLOADER ---
captureBtn.addEventListener("click", async () => {
  const ctx = canvas.getContext("2d");
  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;
  ctx.drawImage(camera, 0, 0);

  canvas.toBlob(async (blob) => {
    const fileName = `photo_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("photos")   // ← CHANGE le nom ici si ton bucket est différent
      .upload(fileName, blob, {
        contentType: "image/jpeg"
      });

    if (!error) loadImages();
  });
});

// --- CHARGER LES IMAGES EXISTANTES ---
async function loadImages() {
  const { data, error } = await supabase.storage
    .from("photos")
    .list("", { limit: 100 });

  if (error) return;

  gallery.innerHTML = "";

  data.forEach(img => {
    const url = `${SUPABASE_URL}/storage/v1/object/public/photos/${img.name}`;

    const imgEl = document.createElement("img");
    imgEl.src = url;
    gallery.appendChild(imgEl);
  });
}

// Charger au démarrage
loadImages();
