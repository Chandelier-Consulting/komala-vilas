import sharp from "sharp";

const W = 1400;
const H = 1800;

function svg(width, height, body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
  );
}

function roundedMask(width, height, radius) {
  return svg(
    width,
    height,
    `<rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>`,
  );
}

async function roundedImage(input, width, height, radius, position = "center") {
  const image = await sharp(input)
    .resize(width, height, { fit: "cover", position })
    .modulate({ saturation: 1.08, brightness: 1.02 })
    .linear(1.04, -4)
    .toBuffer();

  return sharp(image)
    .composite([{ input: roundedMask(width, height, radius), blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function framedCard(input, output, position = "center") {
  const width = 1200;
  const height = 900;
  const photo = await roundedImage(input, 1020, 660, 38, position);
  const base = svg(
    width,
    height,
    `
    <defs>
      <linearGradient id="wood" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#2a100c"/>
        <stop offset="0.55" stop-color="#5b2118"/>
        <stop offset="1" stop-color="#1e0c09"/>
      </linearGradient>
      <pattern id="kolam" width="72" height="72" patternUnits="userSpaceOnUse">
        <circle cx="18" cy="18" r="3" fill="#d99b26" opacity=".5"/>
        <circle cx="54" cy="18" r="3" fill="#fff8ea" opacity=".35"/>
        <circle cx="18" cy="54" r="3" fill="#fff8ea" opacity=".35"/>
        <circle cx="54" cy="54" r="3" fill="#d99b26" opacity=".5"/>
        <path d="M18 18 C38 10 34 62 54 54 M54 18 C34 10 38 62 18 54" fill="none" stroke="#b9852d" stroke-width="1.4" opacity=".32"/>
      </pattern>
    </defs>
    <rect width="1200" height="900" fill="url(#wood)"/>
    <rect x="28" y="28" width="1144" height="844" rx="34" fill="none" stroke="#b9852d" stroke-width="4"/>
    <rect x="46" y="46" width="1108" height="808" rx="26" fill="url(#kolam)" opacity=".72"/>
    <rect x="78" y="76" width="1044" height="748" rx="46" fill="#fff8ea" opacity=".18"/>
    `,
  );

  await sharp(base)
    .composite([{ input: photo, left: 90, top: 112 }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(output);
}

async function buildHero() {
  const background = svg(
    W,
    H,
    `
    <defs>
      <linearGradient id="wood" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#1f0d09"/>
        <stop offset="0.35" stop-color="#4a1a12"/>
        <stop offset="0.75" stop-color="#6f2a1d"/>
        <stop offset="1" stop-color="#210d09"/>
      </linearGradient>
      <radialGradient id="light" cx=".32" cy=".2" r=".9">
        <stop offset="0" stop-color="#fff0c9" stop-opacity=".32"/>
        <stop offset=".48" stop-color="#d99b26" stop-opacity=".12"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <pattern id="temple" width="96" height="96" patternUnits="userSpaceOnUse">
        <circle cx="24" cy="24" r="4" fill="#d99b26" opacity=".48"/>
        <circle cx="72" cy="24" r="4" fill="#fff8ea" opacity=".3"/>
        <circle cx="24" cy="72" r="4" fill="#fff8ea" opacity=".3"/>
        <circle cx="72" cy="72" r="4" fill="#d99b26" opacity=".48"/>
        <path d="M24 24 C52 8 44 88 72 72 M72 24 C44 8 52 88 24 72" fill="none" stroke="#b9852d" stroke-width="1.7" opacity=".34"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#wood)"/>
    <rect width="${W}" height="${H}" fill="url(#temple)" opacity=".78"/>
    <rect width="${W}" height="${H}" fill="url(#light)"/>
    <rect x="54" y="54" width="${W - 108}" height="${H - 108}" rx="560" fill="none" stroke="#b9852d" stroke-width="8"/>
    <rect x="82" y="82" width="${W - 164}" height="${H - 164}" rx="520" fill="none" stroke="#fff8ea" stroke-opacity=".42" stroke-width="3"/>
    <ellipse cx="700" cy="800" rx="560" ry="650" fill="#fff8ea" opacity=".16"/>
    `,
  );

  const dosa = await roundedImage("public/images/masala-dosa.jpg", 1100, 820, 420, "center");
  const thali = await roundedImage("public/images/south-indian-thali.jpg", 430, 430, 215, "center");
  const coffee = await roundedImage("public/images/filter-coffee.jpg", 300, 300, 150, "center");

  await sharp(background)
    .composite([
      { input: svg(1140, 860, `<rect width="1140" height="860" rx="430" fill="#fff8ea" opacity=".22"/>`), left: 130, top: 360 },
      { input: dosa, left: 150, top: 380 },
      { input: svg(470, 470, `<circle cx="235" cy="235" r="235" fill="#b9852d" opacity=".9"/><circle cx="235" cy="235" r="214" fill="#fff8ea" opacity=".35"/>`), left: 780, top: 185 },
      { input: thali, left: 800, top: 205 },
      { input: svg(326, 326, `<circle cx="163" cy="163" r="163" fill="#b9852d" opacity=".9"/><circle cx="163" cy="163" r="148" fill="#fff8ea" opacity=".32"/>`), left: 142, top: 1120 },
      { input: coffee, left: 155, top: 1133 },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile("public/images/komala-vilas-premium-hero.jpg");
}

await buildHero();
await framedCard(
  "public/images/masala-dosa.jpg",
  "public/images/signature-paper-dosa.jpg",
);
await framedCard(
  "public/images/south-indian-thali.jpg",
  "public/images/signature-thali.jpg",
);
await framedCard(
  "public/images/idli-vada.jpg",
  "public/images/signature-idli-vada.jpg",
);
