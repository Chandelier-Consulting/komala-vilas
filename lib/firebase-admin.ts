import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let firebaseAdminApp: App | null = null;
let googleCertCache:
  | {
      certs: Record<string, string>;
      expiresAt: number;
    }
  | null = null;

const GOOGLE_CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

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
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      `${requireEnv("FIREBASE_PROJECT_ID")}.appspot.com`,
  });

  return firebaseAdminApp;
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdmin());
}

export function getAdminStorage() {
  return getStorage(getFirebaseAdmin());
}

function getProjectId() {
  return requireEnv("FIREBASE_PROJECT_ID");
}

function getCacheExpiry(headers: Headers) {
  const cacheControl = headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSeconds = Number(maxAgeMatch?.[1] || "0");

  if (Number.isFinite(maxAgeSeconds) && maxAgeSeconds > 0) {
    return Date.now() + maxAgeSeconds * 1000;
  }

  return Date.now() + 60 * 60 * 1000;
}

async function getGoogleCerts() {
  if (googleCertCache && googleCertCache.expiresAt > Date.now()) {
    return googleCertCache.certs;
  }

  const response = await fetch(GOOGLE_CERT_URL, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Firebase certs: ${response.status}`);
  }

  const certs = (await response.json()) as Record<string, string>;
  googleCertCache = {
    certs,
    expiresAt: getCacheExpiry(response.headers),
  };

  return certs;
}

async function verifyFirebaseIdToken(token: string) {
  const jose = await import("jose");
  const { kid, alg } = jose.decodeProtectedHeader(token);

  if (typeof kid !== "string" || !kid || alg !== "RS256") {
    throw new Error("Invalid Firebase token header.");
  }

  const certs = await getGoogleCerts();
  const cert = certs[kid];

  if (!cert) {
    throw new Error("Firebase token signing key not found.");
  }

  const publicKey = await jose.importX509(cert, "RS256");
  const projectId = getProjectId();
  const { payload } = await jose.jwtVerify(token, publicKey, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Firebase token subject missing.");
  }

  return {
    ...payload,
    uid: payload.sub,
  };
}

export async function verifyAdminRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  try {
    return await verifyFirebaseIdToken(token);
  } catch {
    return null;
  }
}
