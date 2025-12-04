```javascript
const SUPABASE_URL = 'VOTRE_SUPABASE_URL';
const SUPABASE_KEY = 'VOTRE_SUPABASE_SERVICE_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const pointId = new URLSearchParams(window.location.search).get('point') || 'unknown';
document.getElementById('point-id').textContent = pointId;

const fileInput = document.getElementById('file-input');
const takePhotoBtn = document.getElementById('take-photo');
const choosePhotoBtn = document.getElementById('choose-photo');
const sendPhotoBtn = document.getElementById('send-photo');
const previewImg = document.getElementById('preview');
const statusP = document.getElementById('status');

let currentFile = null;

takePhotoBtn.addEventListener('click', () => fileInput.click());
choosePhotoBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  currentFile = file;
  previewImg.src = URL.createObjectURL(file);
  sendPhotoBtn.disabled = false;
});

sendPhotoBtn.addEventListener('click', async () => {
  if (!currentFile) return;
  statusP.textContent = 'Envoi en cours...';

  const formData = new FormData();
  formData.append('photo', currentFile);
  formData.append('point_id', pointId);

  try {
    const res = await fetch('/.netlify/functions/upload-photo', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok) statusP.textContent = 'Photo envoyée !';
    else statusP.textContent = 'Erreur : ' + data.error;

  } catch (err) {
    statusP.textContent = 'Erreur réseau';
    console.error(err);
  }
});
```

---
