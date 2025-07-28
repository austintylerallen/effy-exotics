// src/lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";

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

  // Helpful one-liners to check in DevTools
  window.__FBCFG__ = cfg;
  window.__FBMISSING__ = missing;

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      `[firebase] Missing NEXT_PUBLIC_ env vars: ${missing.join(", ")}\n` +
      "Check .env.local at project root, then restart dev server."
    );
  }
}

// Initialize once (even during Fast Refresh)
export const app = getApps().length ? getApp() : initializeApp(cfg);

// Browser-only getters to avoid SSR usage
export async function getWebAuth() {
  if (typeof window === "undefined") return null;

  // If apiKey is missing, fail early and clearly
  if (!cfg.apiKey) {
    throw new Error(
      "Firebase config is missing apiKey. See console for __FBCFG__ / __FBMISSING__."
    );
  }

  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
}

export async function getWebAnalytics() {
  if (typeof window === "undefined") return null;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    return (await isSupported()) ? getAnalytics(app) : null;
  } catch {
    return null;
  }
}
