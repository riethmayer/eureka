import sharp from "sharp";

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp("public/icon.svg")
      .resize(size, size)
      .png()
      .toFile(`public/icon-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);
