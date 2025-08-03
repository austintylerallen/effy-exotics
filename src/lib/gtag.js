export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Log a pageview
export function pageview(url) {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag?.("config", GA_ID, { page_path: url });
}

// Log custom events
export function gaEvent(action, params = {}) {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag?.("event", action, params);
}
 