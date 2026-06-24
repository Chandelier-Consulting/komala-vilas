"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { DEFAULT_FIREBASE_STORAGE_BUCKET } from "@/lib/firebase-config";

const defaultFirebaseClientConfig = {
  apiKey: "AIzaSyA_vpYwNXZk4GmQ_ziRdqSDFkQIA2aRwq8",
  authDomain: "komala-vilas-4f0c5.firebaseapp.com",
  projectId: "komala-vilas-4f0c5",
  appId: "1:745033737584:web:b197a8cb443f02b188dbb5",
  storageBucket: DEFAULT_FIREBASE_STORAGE_BUCKET,
};

function getFirebaseClientConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseClientConfig.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseClientConfig.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseClientConfig.projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseClientConfig.appId,
    storageBucket: defaultFirebaseClientConfig.storageBucket,
  };
}

export function hasFirebaseClientConfig() {
  const config = getFirebaseClientConfig();
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function getFirebaseClientApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0] as FirebaseApp;

  return initializeApp(getFirebaseClientConfig());
}

export function getFirebaseClientAuth() {
  return getAuth(getFirebaseClientApp());
}
