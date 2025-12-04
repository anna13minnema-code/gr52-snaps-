// app-etape.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://xxx.supabase.co";      // <-- à remplacer
const SUPABASE_KEY = "xxxxx";                       // <-- à remplacer
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Récupère l'étape depuis l'URL : etape1, etape2, etc.
const etape = document.body.dataset.etape;

// Charge les images
async function loadGallery() {
  const { data, error } = await supabase.storage
    .from("photos")                // <-- nom du bucket
    .list(`${etape}/`, {
      limit: 200,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.error(error);
    return;
  }

  const gallery = document.getElementById("gallery");

  for (const file of data) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/photos/${etape}/${file.name}`;

    const img = document.createElement("img");
    img.src = publicUrl;
    img.className = "photo";

    gallery.appendChild(img);
  }
}

loadGallery();
