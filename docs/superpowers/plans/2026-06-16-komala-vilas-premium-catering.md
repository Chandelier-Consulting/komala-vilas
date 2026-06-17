# Komala Vilas Premium Catering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Komala Vilas to an ultra-premium South Indian restaurant site and add catering ordering with Firebase persistence, auth-protected order dashboard, and email notifications.

**Architecture:** Keep public pages mostly server-rendered. Use focused client components only for Framer Motion, catering form state, and Firebase Auth dashboard state. Use App Router route handlers for order creation, order listing, and status updates with lazy Firebase Admin and mail clients.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind v4 CSS tokens, next/font, next/image, Framer Motion, Firebase Admin, Firebase Web SDK, Nodemailer, node:test.

---

### Task 1: Dependencies and plan hygiene

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `docs/superpowers/plans/2026-06-16-komala-vilas-premium-catering.md`

- [ ] Install `framer-motion`, `firebase`, `firebase-admin`, and `nodemailer`.
- [ ] Ignore `.superpowers/`.
- [ ] Keep the approved plan committed with the implementation.

### Task 2: Tests first

**Files:**
- Modify: `tests/page-content.test.mjs`
- Create: `tests/order-workflow.test.mjs`

- [ ] Add content tests for `/catering`, `/dashboard`, premium tokens, `next/font`, `.photo-grade`, no Google CSS import, motion variants, and Firebase files.
- [ ] Add pure order validation tests for required fields, email validation, package validation, guest count, date, and normalized output.
- [ ] Run `npm test` and confirm the new tests fail before implementation.

### Task 3: Design system and motion primitives

**Files:**
- Modify: `app/layout.tsx`
- Replace: `app/globals.css`
- Create: `lib/variants.ts`
- Create: `components/motion-shell.tsx`

- [ ] Use `next/font/google` for serif display, UI sans, and Tamil-supporting text.
- [ ] Define exact palette tokens: ivory, ink, tamarind, vermilion, turmeric, banana leaf, brass, rosewood.
- [ ] Define perfect-fourth type scale tokens.
- [ ] Add Indian patterned body and hero backgrounds without Tailwind arbitrary values.
- [ ] Add `.photo-grade`.
- [ ] Add Framer variants with requested easings and reduced-motion handling.

### Task 4: Premium public pages

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/menu/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/layout.tsx`
- Create: `app/catering/page.tsx`
- Create: `components/catering-form.tsx`

- [ ] Rebuild homepage hero with temple border and heavier pattern background.
- [ ] Update home/menu/about to use premium typography, spacing, section rhythm, and motion wrappers.
- [ ] Add Catering nav/footer link.
- [ ] Build `/catering` with packages, ordering form, pickup guidance, and brand-specific copy.
- [ ] Use `next/image` quality={92} for heroes and quality={85} for cards.

### Task 5: Ordering backend

**Files:**
- Create: `lib/orders.ts`
- Create: `lib/firebase-admin.ts`
- Create: `lib/email.ts`
- Create: `app/api/catering-orders/route.ts`
- Create: `app/api/dashboard/orders/route.ts`
- Create: `app/api/dashboard/orders/[id]/route.ts`

- [ ] Validate and normalize catering order payloads.
- [ ] Save valid orders to Firestore collection `cateringOrders`.
- [ ] Send order email to `CATERING_ORDER_EMAILS`.
- [ ] Verify Firebase ID token for dashboard API routes.
- [ ] Support status update values: `new`, `contacted`, `confirmed`, `completed`, `cancelled`.

### Task 6: Dashboard

**Files:**
- Create: `lib/firebase-client.ts`
- Create: `app/dashboard/page.tsx`
- Create: `components/dashboard-client.tsx`

- [ ] Add email/password Firebase Auth sign-in.
- [ ] Fetch orders with the user ID token.
- [ ] Render order list, detail panel, and status controls.
- [ ] Show useful empty, loading, unauthenticated, and configuration states.

### Task 7: Verification

**Commands:**
- `npm test`
- `npm run lint`
- `npm run build`
- Start dev server and verify public site, catering form, and dashboard shell in browser.

- [ ] Capture desktop and mobile screenshots.
- [ ] Check console health.
- [ ] Verify no clipped/overlapping text.
- [ ] Verify reduced-motion code paths exist in all Framer hook components.
- [ ] Commit logically grouped changes.
