// Image optimisation for the Pearl Diving site.
//
// 1. Generates WebP siblings (quality 80) for every photo shown via <img>.
//    The original JPEG/PNG files are left untouched so they can serve as the
//    <picture> fallback for the (vanishingly few) browsers without WebP.
// 2. Recompresses three heavyweight files in place that can't use <picture>:
//    the favicon (loads on every page) and two CSS-background / OG images.
//
// Run with:  npm run optimize:images
// Safe to re-run for the WebP step (regenerates from untouched originals).
// The in-place recompression is lossy - re-running re-compresses, so only
// run it intentionally when the originals are in a known-good state.

import sharp from "sharp";
import { readFile, stat, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, parse } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "..", "images");

const WEBP_QUALITY = 80;
const JPEG_QUALITY = 80;

// Photos rendered via <img> - each gets a .webp sibling.
const toWebp = [
  "image_history.jpeg",
  "image_technique.jpeg",
  "history_1.jpeg",
  "history_2.png",
  "history_3.jpg",
  "tech_2.jpeg",
  "tech_3.jpg",
  "tech_4.jpg",
  "gallery_1.jpg",
  "gallery_2.jpg",
  "gallery_3.jpg",
  "gallery_4.jpg",
  "gallery_5.jpg",
  "gallery_6.jpg",
  "gallery_7.jpg",
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function sizeOf(file) {
  return (await stat(file)).size;
}

async function generateWebp() {
  console.log("\n→ Generating WebP siblings");
  for (const name of toWebp) {
    const src = join(imagesDir, name);
    const webpName = `${parse(name).name}.webp`;
    const out = join(imagesDir, webpName);
    const before = await sizeOf(src);
    await sharp(await readFile(src))
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);
    const after = await sizeOf(out);

    // For small, already-efficient JPEGs, WebP can be larger. <picture> would
    // force the browser to take it anyway, so discard those - the original wins.
    if (after >= before) {
      await unlink(out);
      console.log(`  ${name}  ${kb(before)} - kept original (WebP was ${kb(after)})`);
    } else {
      console.log(`  ${name}  ${kb(before)} → ${webpName}  ${kb(after)}`);
    }
  }
}

async function recompress() {
  console.log("\n→ Recompressing heavyweight originals in place");

  // Read each file into a Buffer first so sharp never holds a handle on the
  // path it's about to overwrite (Windows refuses to write a mmap'd file).

  // Favicon: 392 KB source down to a 64×64 icon.
  const favicon = join(imagesDir, "favicon.png");
  const faviconBefore = await sizeOf(favicon);
  const faviconOut = await sharp(await readFile(favicon))
    .resize(64, 64, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(favicon, faviconOut);
  console.log(`  favicon.png  ${kb(faviconBefore)} → ${kb(await sizeOf(favicon))}`);

  // CSS background + OG image: re-encode JPEG at quality 80.
  for (const name of ["images_background.jpeg", "tech_1.jpg"]) {
    const file = join(imagesDir, name);
    const before = await sizeOf(file);
    const out = await sharp(await readFile(file))
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    await writeFile(file, out);
    console.log(`  ${name}  ${kb(before)} → ${kb(await sizeOf(file))}`);
  }
}

await generateWebp();
await recompress();
console.log("\n✓ Done.\n");
