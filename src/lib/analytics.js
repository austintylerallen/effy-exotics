// src/lib/analytics.js
// GTM-only helpers. No direct gtag() calls.

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

/** Make absolute and append UTM params without overwriting existing */
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

/** Backward-compatible helper used by older code */
export function detectLocation(pathname = "") {
  // Prefer path hint
  if (pathname.startsWith("/alamogordo")) return "alamogordo";
  if (pathname.startsWith("/las-cruces")) return "las-cruces";

  // Cookie fallback
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)ee_city=(alamogordo|las-cruces)/);
    if (m) return m[1];
  }
  return "site";
}

/** Optional: handy for reporting / pageview labeling */
export function detectPageCategory(pathname = "") {
  if (pathname.includes("/map")) return "directions";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/shop")) return "shop";
  if (pathname.includes("/the-lab")) return "the-lab";
  if (pathname.includes("/faq")) return "faq";
  return "page";
}

/** Push SPA-friendly pageview into GTM dataLayer */
export function pageview(urlOrPath, ctx = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  const path =
    typeof urlOrPath === "string" && urlOrPath.length
      ? urlOrPath
      : window.location.pathname;

  window.dataLayer.push({
    event: "pageview",
    page_view: true,
    page_route: path,
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_category: ctx.page_category || detectPageCategory(path),
    location: ctx.location || detectLocation(path),
  });
}

/** Generic event helper → dataLayer (not direct GA) */
export function gaEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}
