import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let firebaseAdminApp: App | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getFirebaseAdmin() {
  if (firebaseAdminApp) return firebaseAdminApp;
  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0] ?? null;
    if (firebaseAdminApp) return firebaseAdminApp;
  }

  firebaseAdminApp = initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });

  return firebaseAdminApp;
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdmin());
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdmin());
}
