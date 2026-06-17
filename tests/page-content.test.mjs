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
    email,
    firebaseAdmin,
    firebaseAdminAuth,
    cateringRoute,
    dashboardOrdersRoute,
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
    readFile(new URL("../lib/email.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/firebase-admin.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/firebase-auth-rest.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/catering-orders/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/dashboard/orders/route.ts", import.meta.url), "utf8"),
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
  assert.match(email, /import \{ Resend \} from "resend"/);
  assert.match(email, /RESEND_API_KEY/);
  assert.match(email, /resend\.emails\.send/);
  assert.match(email, /onboarding@resend\.dev/);
  assert.match(email, /html: getOrderHtml/);
  assert.match(email, /replyTo: order\.email/);
  assert.match(email, /response\.error/);
  assert.match(email, /console\.warn/);
  assert.match(email, /console\.error/);
  assert.doesNotMatch(email, /nodemailer|SMTP_/);
  assert.match(firebaseAdmin, /getFirebaseAdmin/);
  assert.match(firebaseAdmin, /getAdminDb/);
  assert.doesNotMatch(firebaseAdmin, /firebase-admin\/auth|getAdminAuth/);
  assert.match(firebaseAdminAuth, /accounts:lookup/);
  assert.match(firebaseAdminAuth, /NEXT_PUBLIC_FIREBASE_API_KEY/);
  assert.doesNotMatch(firebaseAdminAuth, /firebase-admin\/auth|getAdminAuth/);
  assert.match(cateringRoute, /getAdminDb/);
  assert.match(cateringRoute, /email/);
  assert.match(cateringRoute, /email_send_failed/);
  assert.doesNotMatch(cateringRoute, /getAdminAuth|firebase-admin-auth|firebase-admin\/auth/);
  assert.match(dashboardOrdersRoute, /verifyFirebaseIdToken/);
  assert.doesNotMatch(dashboardOrdersRoute, /getAdminAuth|firebase-admin-auth|firebase-admin\/auth/);
  assert.match(firebaseClient, /getFirebaseClientApp/);
  assert.match(pkg, /"framer-motion"/);
  assert.match(pkg, /"firebase"/);
  assert.match(pkg, /"firebase-admin"/);
  assert.match(pkg, /"resend"/);
  assert.doesNotMatch(pkg, /"nodemailer"/);
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

test("menu items render as image-backed accordion reveals", async () => {
  const [menuData, menuExplorer, styles] = await Promise.all([
    readFile(new URL("../lib/menu.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/menu-explorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  const menuItemCount = (menuData.match(/\{\s*name:\s*"/g) ?? []).length;
  const imageFieldCount = (menuData.match(/image:\s*"\/images\//g) ?? []).length;

  assert.ok(menuItemCount > 20);
  assert.equal(imageFieldCount, menuItemCount);
  assert.match(menuData, /image: string/);
  assert.match(menuExplorer, /expandedItemKey/);
  assert.match(menuExplorer, /aria-expanded/);
  assert.match(menuExplorer, /onMouseEnter/);
  assert.match(menuExplorer, /menu-item-photo/);
  assert.match(menuExplorer, /menu-item-details/);
  assert.match(styles, /\.menu-item-accordion/);
  assert.match(styles, /\.menu-item-photo/);
  assert.match(styles, /\.menu-item-details/);
});

test("scroll reveal motion waits for meaningful viewport visibility", async () => {
  const motionShell = await readFile(new URL("../components/motion-shell.tsx", import.meta.url), "utf8");

  assert.match(motionShell, /REVEAL_VIEWPORT/);
  assert.match(motionShell, /amount:\s*0\.2/);
  assert.match(motionShell, /margin:\s*"0px 0px -12% 0px"/);
  assert.doesNotMatch(motionShell, /viewport=\{\{ once: true, margin: "-70px" \}\}/);
  assert.doesNotMatch(motionShell, /viewport=\{\{ once: true, margin: "-80px" \}\}/);
});

test("home page has a premium review proof section for demo readiness", async () => {
  const [page, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /featuredReview/);
  assert.match(page, /reviewHighlights/);
  assert.match(page, /review-feature/);
  assert.match(page, /review-proof-bar/);
  assert.match(page, /Most mentioned/);
  assert.match(page, /Book catering from the reviews/);
  assert.match(styles, /\.review-showcase/);
  assert.match(styles, /\.review-feature/);
  assert.match(styles, /\.review-proof-bar/);
});

test("home page includes an interactive feast planner that turns browsing into catering intent", async () => {
  const [page, planner, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/feast-planner.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /FeastPlanner/);
  assert.match(page, /home-section-planner/);
  assert.match(planner, /eventTypes/);
  assert.match(planner, /recommendedPackage/);
  assert.match(planner, /estimatedTrays/);
  assert.match(planner, /Plan this feast/);
  assert.match(planner, /#request\?package=/);
  assert.match(styles, /\.feast-planner/);
  assert.match(styles, /\.planner-guest-control/);
  assert.match(styles, /\.planner-service-flow/);
});

test("home page uses full-width section bands with consistent padding and external nav actions", async () => {
  const [page, nav, restaurant, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/primary-nav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/restaurant.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /home-section home-section-order/);
  assert.match(page, /home-section home-section-signatures/);
  assert.match(page, /home-section home-section-catering/);
  assert.match(page, /home-section home-section-reviews/);
  assert.match(page, /home-section home-section-visit/);
  assert.match(styles, /\.home-section\s*{[^}]*width: 100%/);
  assert.match(styles, /\.home-section > \.section-shell\s*{[^}]*padding-block: 96px/);
  assert.doesNotMatch(page, /className="section-shell section-block"/);
  assert.match(restaurant, /orderUrl/);
  assert.match(nav, /href=\{restaurantInfo\.orderUrl\}/);
  assert.match(nav, /target="_blank"/);
  assert.match(nav, /rel="noreferrer"/);
  assert.match(nav, /Order Online/);
});

test("catering package cards, calculator, and request form share package and guest selections", async () => {
  const [page, form, styles, orders] = await Promise.all([
    readFile(new URL("../app/catering/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/catering-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/orders.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /href=\{`#request\?package=\$\{item\.id\}&guests=\$\{item\.minGuests\}`\}/);
  assert.match(page, /catering-package-link/);
  assert.match(page, /catering-packages-section/);
  assert.match(page, /catering-request-section/);
  assert.match(form, /id="request"/);
  assert.match(form, /new URLSearchParams/);
  assert.match(form, /applyRequestSelection/);
  assert.match(form, /handleRequestLinkClick/);
  assert.match(form, /getRequestSelectionFromHref/);
  assert.match(form, /window\.requestAnimationFrame\(\(\) => applyRequestSelection\(\)\)/);
  assert.match(form, /window\.history\.replaceState/);
  assert.match(form, /href=\{`#request\?package=\$\{bestPackage\.id\}&guests=\$\{guests\}`\}/);
  assert.match(form, /confirmationId/);
  assert.match(form, /1 - 2 business days/);
  assert.match(styles, /\.catering-package-link/);
  assert.match(styles, /\.catering-package-link > div\s*{[^}]*grid-template-rows: auto auto 1fr auto/);
  assert.match(styles, /\.catering-package-link strong\s*{[^}]*width: 100%/);
  assert.match(styles, /\.catering-request-section\s*{[^}]*border-top: 1px solid var\(--color-line\)/);
  assert.match(styles, /\.confirmation-copy/);
  assert.match(styles, /\.estimator-actions/);
  assert.match(orders, /Crisp dosa, masala filling, sambar, chutneys, and rotating chef specials\./);
  assert.doesNotMatch(orders, /focused live-station style menu/);
});
