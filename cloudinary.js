/**
 * ============================================================
 *  Udghosh-23 → Cloudinary Bulk Uploader
 * ============================================================
 *  STEPS:
 *  1. npm install cloudinary         (run once in the project folder)
 *  2. Fill YOUR_CLOUD_NAME, YOUR_API_KEY, YOUR_API_SECRET below
 *  3. node upload_to_cloudinary.js
 *  4. Check cloudinary_urls.json and cloudinary_urls.txt for all links
 * ============================================================
 */

const cloudinary = require("cloudinary").v2;
const fs   = require("fs");
const path = require("path");

// ────────────────────────────────────────────────────────────
//  ✏️  PUT YOUR CLOUDINARY CREDENTIALS HERE
// ────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",   // from Cloudinary dashboard
  api_key:    "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});
// ────────────────────────────────────────────────────────────

const PROJECT_ROOT = __dirname;

const SUPPORTED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".bmp", ".svg", ".tiff", ".tif", ".avif",
]);

// All directories containing images (top-level scan only)
const SCAN_DIRS = [
  "public",
  "public/img",
  "public/images/2023",
  "public/images/2024",
  "public/sponsors/MNP",
  "public/sponsors/Marketing",
  "public/web final",
];

function collectImages(dir) {
  const abs = path.join(PROJECT_ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.has(ext) &&
             fs.statSync(path.join(abs, file)).isFile();
    })
    .map(file => ({
      localPath: path.join(abs, file),
      publicId : path.join(dir, path.parse(file).name).replace(/\\/g, "/"),
    }));
}

async function uploadFile({ localPath, publicId }) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id    : publicId,
      overwrite    : true,
      resource_type: "image",
      folder       : "udghosh-23",   // folder created in your Cloudinary account
    });
    return { localPath, url: result.secure_url, status: "success" };
  } catch (err) {
    console.error(`  ✗ FAILED: ${path.basename(localPath)} — ${err.message}`);
    return { localPath, url: null, status: "error", error: err.message };
  }
}

(async () => {
  console.log("\n🔍  Scanning image folders …\n");

  const allFiles = [];
  const seen     = new Set();

  for (const dir of SCAN_DIRS) {
    for (const f of collectImages(dir)) {
      if (!seen.has(f.localPath)) {
        seen.add(f.localPath);
        allFiles.push(f);
      }
    }
  }

  console.log(`📂  Total images found: ${allFiles.length}\n`);
  if (!allFiles.length) { console.log("Nothing to upload."); return; }

  // Upload 5 at a time
  const CONCURRENCY = 5;
  const results = [];

  for (let i = 0; i < allFiles.length; i += CONCURRENCY) {
    const batch   = allFiles.slice(i, i + CONCURRENCY);
    const done    = await Promise.all(batch.map(uploadFile));
    done.forEach(r => {
      results.push(r);
      if (r.status === "success") {
        console.log(`  ✔  ${path.basename(r.localPath)}`);
        console.log(`       ${r.url}\n`);
      }
    });
  }

  const ok   = results.filter(r => r.status === "success");
  const fail = results.filter(r => r.status === "error");

  console.log("─".repeat(60));
  console.log(`✅  Uploaded : ${ok.length}`);
  console.log(`❌  Failed   : ${fail.length}`);
  console.log("─".repeat(60));

  // ── cloudinary_urls.json ──
  const jsonOut = {};
  ok.forEach(r => { jsonOut[path.relative(PROJECT_ROOT, r.localPath)] = r.url; });
  fs.writeFileSync(
    path.join(PROJECT_ROOT, "cloudinary_urls.json"),
    JSON.stringify(jsonOut, null, 2)
  );
  console.log("\n💾  cloudinary_urls.json  saved in project root");

  // ── cloudinary_urls.txt ──
  let txt = "Udghosh-23 Cloudinary Upload Report\n" + "=".repeat(60) + "\n\n";
  ok.forEach(r => {
    txt += `File : ${path.relative(PROJECT_ROOT, r.localPath)}\nURL  : ${r.url}\n\n`;
  });
  if (fail.length) {
    txt += "\nFailed uploads:\n" + "-".repeat(40) + "\n";
    fail.forEach(r => {
      txt += `File  : ${path.relative(PROJECT_ROOT, r.localPath)}\nError : ${r.error}\n\n`;
    });
  }
  fs.writeFileSync(path.join(PROJECT_ROOT, "cloudinary_urls.txt"), txt);
  console.log("📄  cloudinary_urls.txt   saved in project root\n");
})();