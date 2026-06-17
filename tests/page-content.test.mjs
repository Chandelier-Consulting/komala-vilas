import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("app uses the corrected Komala Vilas brand and restaurant content", async () => {
  const [page, menu, menuExplorer, menuData, about, layout, restaurant, styles, pkg] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/menu-explorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/menu.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/restaurant.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(pkg, /"name": "komala-vilas"/);
  assert.match(layout, /Komala Vilas/);
  assert.match(page, /Komala Vilas/);
  assert.match(page, /South Indian food/);
  assert.match(page, /temple-town depth/);
  assert.match(page, /Every meal should feel like someone was expecting you/);
  assert.match(page, /\/images\/komala-vilas-premium-hero\.jpg/);
  assert.match(page, /\/images\/signature-paper-dosa\.jpg/);
  assert.match(page, /\/images\/signature-thali\.jpg/);
  assert.match(page, /<section className="hero-background background-pattern">/);
  assert.match(page, /<div className="hero-premium section-shell">/);
  assert.match(menu, /export default function MenuPage/);
  assert.match(menuData, /Unlimited South Indian Thali/);
  assert.match(menuExplorer, /menu-filter-bar/);
  assert.match(menu, /<section className="hero-background background-pattern">/);
  assert.match(about, /<section className="hero-background background-pattern">/);
  assert.match(
    restaurant,
    /https:\/\/www\.google\.com\/maps\/place\/Komala\+Vilas\/@37\.3531031,-122\.0116365,15\.64z/,
  );
  assert.match(styles, /\.menu-item:hover[\s\S]*background:/);
  assert.match(styles, /\.menu-page,\s*\.about-page,\s*\.catering-page,\s*\.dashboard-page\s*{[^}]*background: transparent/);
  assert.match(styles, /\.menu-filter-bar\s*{[^}]*width: 100%/);
  assert.match(styles, /\.menu-filter-bar\s*{[^}]*padding:/);
  assert.match(styles, /\.menu-filter-bar a\s*{[^}]*background: var\(--color-tamarind\)/);
  assert.match(styles, /\.menu-filter-bar a\s*{[^}]*box-shadow:[^}]*0 10px 24px -14px rgba\(44, 29, 18, 0\.72\)/);
  assert.match(styles, /\.menu-filter-bar a:hover,\s*\.menu-filter-bar a:focus-visible\s*{[^}]*box-shadow:[^}]*0 16px 30px -12px rgba\(44, 29, 18, 0\.78\)/);
  assert.doesNotMatch(styles, /\.menu-filter-bar a\s*{[^}]*box-shadow:[^}]*0 \d+px 0 rgba/);
  assert.doesNotMatch(styles, /\.menu-filter-bar a::before/);
  assert.doesNotMatch(
    styles,
    /\.functional-menu-list \.menu-group \+ \.menu-group\s*{[^}]*(?:linear-gradient|border-top|border-bottom)/,
  );
  assert.match(about, /export default function AboutPage/);
  assert.match(about, /timelineItems/);
  assert.match(restaurant, /1020 E El Camino Real/);
  assert.doesNotMatch(
    `${page}\n${menu}\n${about}\n${layout}\n${pkg}`,
    /komala-vibes|Komala Vibes|Komala Viles|komala-viles/,
  );
});

test("premium catering refresh adds design tokens, motion, Firebase, and dashboard surfaces", async () => {
  const [
    page,
    menu,
    about,
    catering,
    dashboard,
    layout,
    styles,
    variants,
    orders,
    firebaseAdmin,
    firebaseClient,
    pkg,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catering/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/variants.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/orders.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/firebase-admin.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/firebase-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(styles, /@import url\(/);
  assert.match(layout, /Cormorant_Garamond/);
  assert.match(layout, /Manrope/);
  assert.match(styles, /--color-tamarind/);
  assert.match(styles, /--step-5/);
  assert.match(styles, /\.photo-grade/);
  assert.match(styles, /temple-border/);
  assert.match(styles, /background-pattern/);
  assert.match(variants, /EASE_OUT_EXPO/);
  assert.match(variants, /EASE_SPRING/);
  assert.match(variants, /EASE_DRAMATIC/);
  assert.match(variants, /useReducedMotion/);
  assert.match(`${page}\n${menu}\n${about}\n${catering}`, /quality=\{92\}/);
  assert.match(`${page}\n${menu}\n${about}\n${catering}`, /quality=\{85\}/);
  assert.match(layout, /href="\/catering"/);
  assert.match(catering, /Komala Vilas catering/);
  assert.match(catering, /<section className="hero-background background-pattern">/);
  assert.match(catering, /CateringOrderForm/);
  assert.match(dashboard, /DashboardClient/);
  assert.match(orders, /validateCateringOrder/);
  assert.match(firebaseAdmin, /getFirebaseAdmin/);
  assert.match(firebaseClient, /getFirebaseClientApp/);
  assert.match(pkg, /"framer-motion"/);
  assert.match(pkg, /"firebase"/);
  assert.match(pkg, /"firebase-admin"/);
  assert.match(pkg, /"nodemailer"/);
});

test("launch polish adds no-cost ordering, status, menu, catering, and dashboard improvements", async () => {
  const [
    page,
    menu,
    about,
    catering,
    dashboardClient,
    layout,
    styles,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catering/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/dashboard-client.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /MobileActionBar/);
  assert.match(layout, /restaurantInfo/);
  assert.match(page, /OpenStatus/);
  assert.match(page, /OrderLinkPanel/);
  assert.match(menu, /MenuExplorer/);
  assert.match(catering, /CateringEstimator/);
  assert.match(dashboardClient, /statusCounts/);
  assert.match(dashboardClient, /exportOrdersCsv/);
  assert.match(dashboardClient, /window\.print/);
  assert.match(styles, /\.mobile-action-bar/);
  assert.match(styles, /\.open-status/);
  assert.match(styles, /\.order-link-panel/);
  assert.match(styles, /\.menu-search/);
  assert.match(styles, /\.dashboard-filters/);

  assert.match(page, /<div className="hero-premium section-shell">/);
  for (const source of [menu, about, catering]) {
    assert.match(source, /<section className="hero-background background-pattern">/);
    assert.match(source, /<div className="section-shell page-hero/);
  }
});

test("hero background pattern runs as one full-width section band without internal breaks", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(styles, /\.background-pattern::before\s*{[^}]*inset: 0;/);
  assert.doesNotMatch(styles, /\.background-pattern::before\s*{[^}]*inset: 38px 0/);
  assert.doesNotMatch(styles, /\.background-pattern::before\s*{[^}]*border-block:/);
  assert.match(styles, /\.hero-background\s*{[^}]*background:/);
  assert.match(styles, /\.site-header\s*{[^}]*radial-gradient/);
  assert.doesNotMatch(styles, /\.site-header\s*{[^}]*background: rgba\(255, 248, 234, 0\.9\)/);
});

test("catering order form uses a polished grouped intake layout", async () => {
  const [form, styles] = await Promise.all([
    readFile(new URL("../components/catering-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(form, /order-form-heading/);
  assert.match(form, /form-section/);
  assert.match(form, /form-section-title/);
  assert.match(form, /form-submit-row/);
  assert.match(styles, /\.order-form-heading/);
  assert.match(styles, /\.form-section/);
  assert.match(styles, /\.package-choice\s*{[^}]*min-height:/);
  assert.match(styles, /input:focus-visible,\s*textarea:focus-visible,\s*select:focus-visible/);
});
