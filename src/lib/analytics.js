// src/lib/analytics.js
// GTM-only helpers. No direct gtag() calls anywhere.

// ----- URL helpers -----
const FALLBACK_SITE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://www.effyexotics.com";

function toAbsoluteUrl(input, base = FALLBACK_SITE) {
  try {
    if (/^(tel:|mailto:|javascript:)/i.test(String(input))) return String(input);
    return new URL(input, base).toString();
  } catch {
    return String(input || "");
  }
}

/** Make absolute and append UTM params (won’t overwrite existing) */
export function withUTM(input, params = {}, base) {
  const url = new URL(toAbsoluteUrl(input, base));
  const defaults = { utm_source: "site", utm_medium: "cta", utm_campaign: "effyexotics" };
  const merged = { ...defaults, ...params };
  for (const [k, v] of Object.entries(merged)) {
    if (!k || v == null || v === "" || url.searchParams.has(k)) continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

// ----- Page context helpers -----
/** Determine city/location from path or cookie (back-compat for older code) */
export function detectLocation(pathname = "") {
  if (pathname.startsWith("/alamogordo")) return "alamogordo";
  if (pathname.startsWith("/las-cruces")) return "las-cruces";
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)ee_city=(alamogordo|las-cruces)/);
    if (m) return m[1];
  }
  return "site";
}

/** Classify route into a simple category string */
export function detectPageCategory(pathname = "") {
  if (!pathname) return "page";
  if (pathname.includes("/map")) return "directions";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/shop")) return "shop";
  if (pathname.includes("/the-lab")) return "the-lab";
  if (pathname.includes("/faq")) return "faq";
  return "page";
}

/** Back-compat alias: old code calls `categorize()` */
export const categorize = detectPageCategory;

// ----- DataLayer pushers -----
/** Push SPA-friendly pageview into GTM dataLayer */
export function pageview(urlOrPath, ctx = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  const path =
    typeof urlOrPath === "string" && urlOrPath.length
      ? urlOrPath
      : window.location?.pathname || "/";

  window.dataLayer.push({
    event: "pageview",
    page_view: true,
    page_route: path,
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_category: ctx.page_category || detectPageCategory(path),
    location: ctx.location || detectLocation(path),
    // include site URL for clarity if you want:
    // page_location: typeof window !== "undefined" ? window.location.href : ""
  });
}

/** Generic event helper → dataLayer (not direct GA) */
export function gaEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

// Default export for modules that do `import analytics from '../lib/analytics'`
const Analytics = {
  withUTM,
  detectLocation,
  detectPageCategory,
  categorize,
  pageview,
  gaEvent,
};
export default Analytics;
