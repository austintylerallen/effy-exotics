// src/lib/track.js
export function track(event, params = {}) {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    // Optional: keep GA4 in sync if a direct gtag ever exists
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
    if (process.env.NODE_ENV !== "production") {
      console.debug("[track]", event, params);
    }
  }
  