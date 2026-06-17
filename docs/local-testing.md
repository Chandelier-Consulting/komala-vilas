# Local Testing Guide

This project is a Next.js App Router site with:

- Public restaurant pages: `/`, `/menu`, `/about`, `/catering`
- Catering order form: `POST /api/catering-orders`
- Staff dashboard: `/dashboard`
- Firebase Admin for Firestore writes and dashboard API auth
- Firebase Web Auth for staff sign-in
- SMTP email notifications through Nodemailer

## 1. Install and smoke test

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/menu`
- `http://localhost:3000/catering`
- `http://localhost:3000/dashboard`

If `npm run build` fails on font fetching, rerun with internet access. `next/font/google` downloads fonts at build time and self-hosts them.

## 2. Environment variables

Create `.env.local`:

```bash
# Firebase Admin SDK, server only
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web SDK, browser-safe
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Email notifications
CATERING_ORDER_EMAILS=owner@example.com,manager@example.com
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
CATERING_EMAIL_FROM="Komala Vilas <orders@example.com>"
```

Notes:

- Keep `.env.local` uncommitted.
- `FIREBASE_PRIVATE_KEY` must preserve newlines as `\n`.
- If SMTP is missing, orders still save, but email sending is skipped.

## 3. Firebase setup

Use one Firebase project for the restaurant.

1. In Firebase Console, create/select the project.
2. Enable Firestore.
3. Enable Authentication with Email/Password.
4. Create one staff user in Authentication.
5. Create a service account key for Firebase Admin.
6. Copy the service account values into `.env.local`.
7. Copy web app config values into the `NEXT_PUBLIC_FIREBASE_*` vars.

Firestore collection used:

```text
cateringOrders
```

The server writes fields:

```text
name
email
phone
eventDate
guestCount
packageId
packageName
pickupWindow
notes
status
createdAt
updatedAt
```

## 4. Test the public site

Manual checklist:

- Home hero fills full browser width.
- Pattern background appears only on home hero.
- Menu/about/catering page hero sections do not have patterned breaks.
- “Open Full Menu” and other buttons do not wrap.
- Signature cards use generated premium assets.
- Mobile width does not clip hero text or buttons.

## 5. Test catering order submission

Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000/catering`.

Submit a test order:

- Name: Test Guest
- Email: test@example.com
- Phone: 408-555-0100
- Event date: any future date
- Guests: 25
- Package: Temple Feast
- Pickup / delivery window: Saturday 11:30 AM

Expected:

- Form shows an order received message.
- A new document appears in Firestore `cateringOrders`.
- Email is sent if SMTP is configured.

API-only test:

```bash
curl -i http://localhost:3000/api/catering-orders \
  -H "content-type: application/json" \
  -d '{
    "name":"Test Guest",
    "email":"test@example.com",
    "phone":"408-555-0100",
    "eventDate":"2026-08-15",
    "guestCount":"25",
    "packageId":"temple-feast",
    "pickupWindow":"Saturday 11:30 AM",
    "notes":"Test order"
  }'
```

Expected status: `201`.

## 6. Test dashboard auth and order management

Open:

```text
http://localhost:3000/dashboard
```

Expected flows:

- If Firebase public env vars are missing, dashboard shows configuration message.
- If configured, dashboard shows staff sign-in.
- Sign in with the Firebase Auth staff user.
- Orders load from Firestore.
- Selecting an order shows details.
- Status dropdown updates Firestore through `/api/dashboard/orders/[id]`.

Status values:

```text
new
contacted
confirmed
completed
cancelled
```

## 7. Before pushing/deploying

Run:

```bash
npm test
npm run lint
npm run build
git status --short
```

Do not deploy with a dirty tree unless the dirty files are intentional.

## 8. Low-cost testing strategy

To avoid adding cost for a small/medium restaurant:

- Use Firebase free tier unless real order volume proves otherwise.
- Use an existing low-cost SMTP provider or the restaurant email host.
- Do not add paid analytics, paid monitoring, paid booking tools, or SMS until there is a clear operational need.
- Test email manually with one real owner inbox before launch.
- Use Firebase Console as the source of truth while order volume is low.
