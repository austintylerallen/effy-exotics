// src/lib/analytics.js
// GTM-only helpers. No direct gtag() calls.
// Safe on server (SSR) and browser.

const FALLBACK_SITE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://www.effyexotics.com";

function toAbsoluteUrl(input, base = FALLBACK_SITE) {
  try {
    // leave tel:, mailto:, javascript: untouched
    if (/^(tel:|mailto:|javascript:)/i.test(String(input))) return String(input);
    return new URL(input, base).toString();
  } catch {
    return String(input || "");
  }
}

/**
 * Append/merge UTM params onto a URL (relative or absolute).
 * Won't overwrite existing UTM params.
 */
export function withUTM(input, params = {}, base) {
  const url = new URL(toAbsoluteUrl(input, base));
  const defaults = {
    utm_source: "site",
    utm_medium: "cta",
    utm_campaign: "effyexotics",
  };
  const merged = { ...defaults, ...params };

  Object.entries(merged).forEach(([k, v]) => {
    if (!k) return;
    if (url.searchParams.has(k)) return; // don't overwrite existing
    if (v == null || v === "") return;
    url.searchParams.set(k, String(v));
  });

  return url.toString();
}

/** Push a SPA-friendly pageview into the dataLayer */
export function pageview(urlOrPath, ctx = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  const path =
    typeof urlOrPath === "string" && urlOrPath.length
      ? urlOrPath
      : window.location.pathname;

  const guessCategory = (p) =>
    p.includes("/map")
      ? "directions"
      : p.includes("/about")
      ? "about"
      : p.includes("/shop")
      ? "shop"
      : p.includes("/the-lab")
      ? "the-lab"
      : p.includes("/faq")
      ? "faq"
      : "page";

  const guessLocation = (p) =>
    p.startsWith("/alamogordo")
      ? "alamogordo"
      : p.startsWith("/las-cruces")
      ? "las-cruces"
      : "site";

  window.dataLayer.push({
    event: "pageview", // <-- GTM Custom Event trigger listens for this
    page_view: true,
    page_route: path,
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_category: ctx.page_category || guessCategory(path),
    location: ctx.location || guessLocation(path),
  });
}

/** Generic event helper (pushes to dataLayer, not GA directly) */
export function gaEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}
