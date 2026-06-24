# Admin Content Firestore Design

## Goal

Give a non-technical manager a real admin dashboard for:

- Managing catering requests in a cleaner, more professional surface
- Editing live menu item content without changing code
- Managing website photos by uploading new assets and assigning them to menu items

The system must persist changes in Firebase, work locally in development, and keep public page load times relatively quick.

## Scope

In scope:

- Fix local Firebase connectivity for the dashboard and server APIs
- Upgrade the dashboard from a single catering-orders view into a multi-surface admin
- Keep menu section structure fixed in code
- Allow item-level editing for menu content
- Allow image uploads and image assignment through admin
- Improve catering order presentation in the admin
- Improve Resend catering notification emails

Out of scope:

- Reordering or creating menu sections
- Reordering items across sections
- A separate standalone CMS
- Browser mockups or visual previews during planning

## Current State

- `components/dashboard-client.tsx` only supports catering order review
- `lib/menu.ts` hardcodes all public menu content
- Public images are static files under `public/images`
- Firebase client auth is only partially wired
- Server-side Firebase uses admin credentials, but there is no content model for menu or photos
- Catering email output is a minimal HTML table with weak hierarchy and branding

## Recommended Approach

Use Firebase end to end:

- Firestore stores menu item overrides and image asset metadata
- Firebase Storage stores uploaded image binaries
- Next.js admin APIs mediate all read/write operations
- Public pages read merged content server-side, with fallback to current code defaults when Firestore content is unavailable

This preserves the existing stack, avoids building a second back office, and gives managers a simple workflow that survives deploys.

## Architecture

### Fixed menu structure with editable item overrides

Keep section metadata in `lib/menu.ts`, but give every item a stable `id`. Public rendering will:

1. Read the fixed section structure from code
2. Read menu item override documents from Firestore
3. Merge Firestore fields onto matching items by `id`

This keeps structure stable while allowing content edits.

### Photo library

Images become managed assets instead of hardcoded file paths.

- Existing `public/images` files serve as fallback seed assets
- New uploads go to Firebase Storage
- Firestore stores metadata and the public URL used by the website
- Menu items point to an `imageAssetId`

“Override `public/images`” means the live site no longer depends on static file replacement for ongoing content changes. Existing files remain useful as initial defaults and local fallback content.

### Admin dashboard surfaces

The admin dashboard becomes three surfaces inside the existing `/dashboard` route:

- `Orders`
- `Menu`
- `Photos`

This keeps a single staff entry point and avoids unnecessary routing complexity.

## Data Model

### `menuItemOverrides/{itemId}`

- `itemId`
- `sectionId`
- `name`
- `description`
- `price`
- `tags: string[]`
- `popular: boolean`
- `cateringFriendly: boolean`
- `imageAssetId: string | null`
- `updatedAt`

Only overridden fields need to be stored, but storing a full normalized editable payload is acceptable if it simplifies forms and API handling.

### `imageAssets/{assetId}`

- `label`
- `alt`
- `storagePath`
- `downloadUrl`
- `width`
- `height`
- `status` (`active` or `archived`)
- `createdAt`
- `updatedAt`

If lightweight blur placeholders are easy to generate during upload, store one. If not, skip it for this iteration and rely on proper image sizing.

### Existing `cateringOrders`

Retain the collection, but improve the admin presentation layer and outbound email formatting.

## Admin UX

### Orders surface

- Keep sign-in and auth gating
- Replace the current generic list/detail layout with a cleaner management surface
- Preserve search, status filtering, status updates, CSV export, and printable order detail
- Improve hierarchy, spacing, and action grouping so it matches the rest of the site

### Menu surface

Managers can edit:

- Item name
- Description
- Price
- Tags
- `popular`
- `cateringFriendly`
- Assigned image

Section boundaries remain fixed. The surface should feel like editing a catalog, not raw JSON.

### Photos surface

Managers can:

- Browse current available assets
- Upload a new image
- Enter a label and alt text
- Reuse an uploaded image across multiple menu items
- Archive unused assets from the picker without deleting historical references immediately

To keep load times reasonable, the UI should encourage a constrained library rather than unlimited duplicate uploads.

## Public Site Read Path

Server-side menu reads should:

1. Start from hardcoded defaults
2. Fetch Firestore overrides and image metadata
3. Merge results into the public menu payload
4. Fall back to defaults if Firebase is unavailable or empty

This keeps the public site resilient during local development and deployment issues.

## Firebase and Local Development

### Client auth

Fix local dashboard auth so `NEXT_PUBLIC_FIREBASE_*` config is validated consistently and surfaced clearly when missing.

### Admin verification

Prefer Firebase Admin token verification on the server over REST lookup when possible. This removes unnecessary dependence on a client API key for protected dashboard APIs and is a more coherent auth boundary.

### Storage

Uploads should go through a server-controlled path that validates auth, file type, and file size before saving to Firebase Storage and returning metadata.

## Email Redesign

Replace the current bare table email with:

- Branded header
- Clear event summary
- Stronger typography and spacing
- Distinct sections for customer info, event details, and notes
- Better subject line consistency
- Clean plain-text fallback

The goal is operational clarity first, with presentation upgraded enough that the message no longer feels improvised.

## Performance

- Use constrained rendered image sizes in public components and admin cards
- Avoid sending full-resolution images where smaller display sizes are sufficient
- Keep Firestore reads narrow and predictable
- Cache or memoize server-side content assembly where appropriate
- Preserve static fallback behavior so the site still renders even if Firebase content is missing

This is sufficient for current startup-stage needs without adding speculative image infrastructure.

## Error Handling

- Missing Firebase config should produce explicit admin guidance
- Failed uploads should not create dangling Firestore records
- Failed content fetches should fall back to code defaults for public pages
- Archived images referenced by items should display clearly in admin so managers can repair broken assignments before unpublishing

## Testing and Verification

Minimum verification:

- Lint
- Typecheck via `next build` or equivalent build validation
- Automated tests for menu merge logic and key API validation paths where practical
- Manual verification of local sign-in, order loading, menu editing, image upload, and email payload generation

## Implementation Order

1. Stabilize Firebase auth/admin wiring locally
2. Introduce menu item ids and mergeable content model
3. Add Firestore read/write APIs for menu items and images
4. Add Firebase Storage upload flow
5. Rebuild dashboard into orders/menu/photos surfaces
6. Upgrade public menu rendering to consume live content
7. Redesign catering emails
8. Run verification and fix regressions

## Risks and Mitigations

- Risk: image upload complexity slows delivery
  - Mitigation: keep first version limited to one managed library and one assignment flow
- Risk: broken Firebase config blocks local work
  - Mitigation: implement clear fallback and explicit diagnostics early
- Risk: public pages regress if live content is missing
  - Mitigation: preserve hardcoded defaults as fallback until the new content path is proven stable

## Success Criteria

- Staff can sign into `/dashboard` locally with working Firebase auth
- Staff can manage catering orders in a professional-looking surface
- Staff can edit menu item content without code changes
- Staff can upload and assign photos without touching `public/images`
- Public pages reflect persisted Firestore content
- Catering emails are operationally clear and visually respectable
