// src/lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Client-side: validate and expose for quick debugging
if (typeof window !== "undefined") {
  const missing = Object.entries(cfg)
    .filter(([_, v]) => !v)
    .map(([k]) => k);

  window.__FBCFG__     = cfg;
  window.__FBMISSING__ = missing;

  if (missing.length) {
    console.error(
      `[firebase] Missing NEXT_PUBLIC_ env vars: ${missing.join(", ")}\n` +
      "Check .env.local at project root, then restart dev server."
    );
  }
}

// Initialize once (even during Fast Refresh)
export const app = getApps().length > 0 ? getApp() : initializeApp(cfg);

// Browser-only getters to avoid SSR usage
export function getWebAuth() {
  if (typeof window === "undefined") return null;

  if (!cfg.apiKey) {
    throw new Error(
      "Firebase config is missing apiKey. See console for __FBCFG__ / __FBMISSING__."
    );
  }

  return getAuth(app);
}

export function getWebAnalytics() {
  if (typeof window === "undefined") return null;

  return isSupported()
    .then((supported) => (supported ? getAnalytics(app) : null))
    .catch(() => null);
}
