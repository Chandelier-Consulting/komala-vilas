# Progress

Last updated: 2026-06-17

## Completed in this chat

### Premium redesign

- Replaced generic baseline with premium South Indian restaurant direction.
- Added serif-led typography through `next/font`.
- Added tokenized palette and perfect-fourth type scale.
- Added temple-border hero treatment.
- Added motion primitives in `lib/variants.ts`.
- Added Framer Motion wrappers with reduced-motion checks.
- Added section rhythm and spacing cleanup.
- Fixed hero text wrapping.
- Fixed button text wrapping.
- Fixed card image crop consistency.
- Fixed home hero background so it extends full width.
- Removed patterned hero background from menu/about/catering pages where it created awkward section breaks.

### Bespoke assets

- Debugged the `image_gen` file issue.
- Found that generated images were visible inline but not exposed as files in this environment.
- No `OPENAI_API_KEY` was available for CLI fallback.
- Built deterministic bespoke raster assets locally with `sharp`.
- Added:
    - `public/images/komala-vilas-premium-hero.jpg`
    - `public/images/signature-paper-dosa.jpg`
    - `public/images/signature-thali.jpg`
    - `public/images/signature-idli-vada.jpg`
- Added reproducible generator:
    - `scripts/build-premium-assets.mjs`
- Wired hero and signature cards to the bespoke assets.

### Catering and ordering

- Added `/catering`.
- Added catering packages.
- Added client-side catering order form.
- Added server route:
    - `POST /api/catering-orders`
- Added order validation in `lib/orders.ts`.
- Added Firestore persistence through Firebase Admin.
- Added email notification through Resend.
- Added env-configured recipient list via `CATERING_ORDER_EMAILS`.

### Dashboard

- Added `/dashboard`.
- Added Firebase Auth sign-in.
- Added protected order list route:
    - `GET /api/dashboard/orders`
- Added protected status update route:
    - `PATCH /api/dashboard/orders/[id]`
- Added order detail view.
- Added status values:
    - `new`
    - `contacted`
    - `confirmed`
    - `completed`
    - `cancelled`

### Documentation

- Added local full-function testing guide:
    - `docs/local-testing.md`
- Added deployment guide:
    - `docs/deployment.md`
- Added this progress file:
    - `progress.md`

### Verification run during work

- `npm test`
- `npm run lint`
- `npm run build`
- Multiple commits created:
    - `12d8c3c feat: add premium catering workflow`
    - `57db723 fix: tighten premium layout wrapping`
    - `a423e98 feat: add bespoke premium food assets`
    - `6aa5064 fix: align hero background treatment`

## Known limitations

- Full browser screenshot QA was limited because `agent-browser` was unavailable in this environment.
- The bespoke assets are generated composites from existing restaurant photos plus custom framing, not AI-generated files, because the built-in image generation tool did not expose filesystem artifacts.
- The catering workflow requires Firebase and Resend env vars before it works end-to-end.
- The dashboard is functional but utilitarian.
- The public site does not yet expose all real ordering platform links.
- Open/closed status is static copy today, not dynamic.

## What needs to continue being fixed

### Must fix before launch

- Configure Firebase production project.
- Configure Firebase Auth staff users.
- Configure Resend.
- Submit a real test catering order in production.
- Confirm Firestore write.
- Confirm email notification.
- Confirm dashboard status update.
- Add real online ordering links if the restaurant uses DoorDash, Uber Eats, Postmates, Toast, Square, Clover, or its own ordering page.
- Add final real hours.
- Confirm holiday hours policy.
- Confirm menu prices and item names with restaurant owner.
- Confirm phone/address/map link.
- Confirm all photos are allowed to be used commercially.

### Visual polish still worth doing

- Replace the source food photos with higher-quality original restaurant photography when available.
- Tune hero image crop after browser screenshot review.
- Check mobile hero composition in a real browser.
- Check typography line breaks on common mobile widths.
- Add active nav state.
- Add better dashboard empty states.

## Low-cost “more React site” improvements

These should make the site feel more modern and useful without adding meaningful recurring cost.

### Ordering and delivery links

- Add a small “Order now” panel with external links:
    - DoorDash
    - Uber Eats
    - Postmates, if still relevant through Uber Eats
    - Toast/Square/Clover, if the restaurant uses one
    - Native restaurant ordering page, if available
- Use plain outbound links. Do not build custom delivery integrations.
- Add UTM parameters only if the restaurant already tracks them.
- Keep catering order form separate from third-party delivery.

### Open/closed status

- Add local static hours data in code.
- Compute “Open now” in the browser using local time.
- Show next opening time.
- Do not pay for a hours API.
- Add a manual holiday notice field in code or env.

### Feedback links

- Add “Leave feedback” links:
    - Google review link
    - Yelp link, if owner wants it
    - Direct email feedback link
- Add a small “Problem with an order?” mailto link.
- Do not add paid feedback tools.

### Calls and directions

- Add sticky mobile action bar:
    - Call
    - Directions
    - Order
    - Catering
- Use normal `tel:` and Google Maps links.
- No paid service needed.

### Menu UX

- Add menu search/filter using client state.
- Add category tabs with scroll-spy.
- Add dietary tags: vegan, Jain-friendly on request, gluten-free where true.
- Add “popular” and “catering-friendly” labels.
- Keep menu data local unless the owner needs frequent edits.

### Catering UX

- Add package quantity estimator.
- Add “serves X” calculator.
- Add pickup/delivery note.
- Add downloadable catering PDF generated from static content.
- Keep all calculations local.

### Trust and conversion

- Add real storefront photo.
- Add real Google rating text only if verified.
- Add “Pure Vegetarian” and “South Indian” proof points.
- Add “Call for same-day catering” if operationally true.

### Dashboard improvements

- Add CSV export.
- Add print order button.
- Add date filters.
- Add search by name/phone/email.
- Add status counts.
- Keep in Firestore. Do not add a CRM unless volume proves it is needed.

## Cost guardrails

Do not increase recurring cost for the small/medium restaurant unless there is evidence it saves staff time or increases orders.

Avoid by default:

- SMS notifications.
- Paid analytics.
- Paid chat widgets.
- Paid reservation systems.
- Paid CRM.
- Paid email marketing.
- Paid A/B testing.
- Paid uptime monitoring.
- Custom DoorDash/Uber integrations.

Prefer:

- Static pages.
- Existing third-party order links.
- Firebase free/low tier.
- Resend free tier for restaurant email notifications.
- Manual owner-controlled content.
- Simple dashboard tools.

## Next recommended work order

1. Collect real owner links:
    - DoorDash/Uber/Postmates/order URL
    - Google review URL
    - Yelp URL
    - Instagram URL
2. Add low-cost action bar and order links.
3. Add open/closed status from local hours data.
4. Browser QA desktop and mobile.
5. Configure Firebase and Resend.
6. Deploy preview to Vercel.
7. Test one real catering order.
8. Launch production domain.
