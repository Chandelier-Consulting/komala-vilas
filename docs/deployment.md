# Deployment Guide

Recommended target: Vercel.

Reason: this app uses Next.js App Router route handlers for catering orders and dashboard APIs. Vercel supports this without adding a separate backend server.

## 1. Pre-deploy checklist

Run locally:

```bash
npm test
npm run lint
npm run build
```

Confirm these are ready:

- Firebase project created.
- Firestore enabled.
- Firebase Auth Email/Password enabled.
- Staff user created.
- Firebase Admin service account values available.
- SMTP provider credentials available.
- Real recipient emails for catering orders confirmed.

## 2. Vercel project setup

Option A: Git integration.

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Framework should auto-detect as Next.js.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Output directory: leave default.

Option B: CLI deploy.

```bash
npm i -g vercel
vercel login
vercel
```

Production deploy:

```bash
vercel --prod
```

## 3. Set Vercel environment variables

Set these for Production and Preview:

```bash
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
CATERING_ORDER_EMAILS
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
CATERING_EMAIL_FROM
```

CLI example:

```bash
vercel env add FIREBASE_PROJECT_ID production
vercel env add FIREBASE_CLIENT_EMAIL production
vercel env add FIREBASE_PRIVATE_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add CATERING_ORDER_EMAILS production
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_SECURE production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add CATERING_EMAIL_FROM production
```

Important:

- `FIREBASE_PRIVATE_KEY` should include `\n` newline escapes.
- `NEXT_PUBLIC_*` values are visible in the browser by design.
- Firebase Admin and SMTP values must not be exposed as `NEXT_PUBLIC_*`.

## 4. First production deploy

With Git integration:

```bash
git push
```

Vercel creates a Preview deployment for branches/PRs and a Production deployment for the production branch.

With CLI:

```bash
vercel --prod
```

## 5. Production verification

After deploy, test:

- `/` loads and hero renders.
- `/menu` loads.
- `/about` loads.
- `/catering` loads.
- `/dashboard` loads.
- Submit one real test catering order.
- Confirm Firestore document is created.
- Confirm email arrives at every address in `CATERING_ORDER_EMAILS`.
- Sign in to dashboard.
- Change test order status to `contacted`.
- Confirm Firestore status changed.

Then delete or mark the test order as `cancelled`.

## 6. Domain setup

In Vercel:

1. Add the restaurant domain.
2. Follow Vercel DNS instructions.
3. Set production domain as the primary domain.
4. Check both `www` and apex domain redirects.

Suggested redirects:

- `komalavilas.com` -> primary domain
- `www.komalavilas.com` -> primary domain

## 7. Rollback

If a deployment breaks:

```bash
vercel rollback
```

Or use the Vercel dashboard:

1. Open project.
2. Go to Deployments.
3. Pick previous known-good deployment.
4. Promote or rollback.

## 8. Keep cost low

Do:

- Keep hosting on Vercel free/low plan until traffic proves otherwise.
- Keep Firebase on free/low tier until order volume proves otherwise.
- Use email notifications instead of SMS.
- Use static pages and simple server routes.
- Avoid paid plugins unless the restaurant asks for the workflow.

Do not add by default:

- Paid analytics.
- Paid SMS.
- Paid live chat.
- Paid reservation systems.
- Paid CRM.
- Paid monitoring beyond what hosting/email/Firebase already expose.

## 9. Useful official references

- Vercel deployments: https://vercel.com/docs/deployments
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Firebase Admin setup: https://firebase.google.com/docs/admin/setup
- Firebase Email/Password Auth: https://firebase.google.com/docs/auth/web/password-auth
