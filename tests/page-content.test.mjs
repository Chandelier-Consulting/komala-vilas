import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("app uses the corrected Komala Vilas brand and restaurant content", async () => {
  const [page, menu, about, layout, styles, pkg] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(pkg, /"name": "komala-vilas"/);
  assert.match(layout, /Komala Vilas/);
  assert.match(page, /Komala Vilas/);
  assert.match(page, /The taste of South India/);
  assert.match(page, /falling-spices/);
  assert.match(page, /Every meal should feel like someone was expecting you/);
  assert.match(page, /\/images\/masala-dosa\.jpg/);
  assert.match(page, /\/images\/south-indian-thali\.jpg/);
  assert.match(menu, /export default function MenuPage/);
  assert.match(menu, /Unlimited South Indian Thali/);
  assert.match(menu, /menu-filter-bar/);
  assert.match(
    layout,
    /https:\/\/www\.google\.com\/maps\/place\/Komala\+Vilas\/@37\.3531031,-122\.0116365,15\.64z/,
  );
  assert.match(styles, /\.menu-item:hover[\s\S]*background:/);
  assert.match(styles, /\.menu-page[\s\S]*background: var\(--background\)/);
  assert.match(styles, /\.menu-filter-bar\.section-shell\s*{[^}]*width: 100%/);
  assert.match(styles, /\.menu-filter-bar\.section-shell\s*{[^}]*padding-inline:/);
  assert.match(styles, /\.menu-filter-bar a\s*{[^}]*background: var\(--spice\)/);
  assert.match(styles, /\.menu-filter-bar a\s*{[^}]*box-shadow:[^}]*0 10px 24px -14px rgba\(44, 29, 18, 0\.72\)/);
  assert.match(styles, /\.menu-filter-bar a:hover,\s*\.menu-filter-bar a:focus-visible\s*{[^}]*box-shadow:[^}]*0 16px 30px -12px rgba\(44, 29, 18, 0\.78\)/);
  assert.doesNotMatch(styles, /\.menu-filter-bar a\s*{[^}]*box-shadow:[^}]*0 \d+px 0 rgba/);
  assert.doesNotMatch(styles, /\.menu-filter-bar a::before/);
  assert.doesNotMatch(
    styles,
    /\.functional-menu-list \.menu-group \+ \.menu-group\s*{[^}]*(?:linear-gradient|border-top|border-bottom)/,
  );
  assert.match(about, /export default function AboutPage/);
  assert.match(about, /timeline-curve/);
  assert.match(about, /timelineItems/);
  assert.match(page, /1020 E El Camino Real/);
  assert.doesNotMatch(
    `${page}\n${menu}\n${about}\n${layout}\n${pkg}`,
    /komala-vibes|Komala Vibes|Komala Viles|komala-viles/,
  );
});
