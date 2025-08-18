// Minimal analytics helper used by _app.js and CTA components

export function detectLocation(pathname) {
    try {
      const m = String(pathname || window.location.pathname).match(/^\/(las-cruces|alamogordo)/);
      if (m) return m[1];
      const c = (typeof document !== "undefined" && document.cookie.match(/(?:^|;\s*)ee_city=([^;]+)/)) || null;
      if (c) return c[1];
    } catch {}
    return "site";
  }
  
  export function categorize(pathname = "/") {
    const p = String(pathname);
    if (p.endsWith("/")) pathname = p.slice(0, -1) || "/";
    // normalize without query/hash
    const core = p.split("?")[0].split("#")[0];
  
    if (/\/(las-cruces|alamogordo)\/?$/.test(core)) return "home";
    if (/\/(las-cruces|alamogordo)\/about\/?$/.test(core)) return "about";
    if (/\/(las-cruces|alamogordo)\/map\/?$/.test(core)) return "directions";
    if (/\/(las-cruces|alamogordo)\/(shop|traphouse)\/?$/.test(core)) return "shop";
    if (/\/(las-cruces|alamogordo)\/faq\/?$/.test(core)) return "faq";
    if (/\/(las-cruces|alamogordo)\/the-lab\/?$/.test(core)) return "lab";
    if (/\/coming-soon\/?$/.test(core)) return "coming-soon";
    return "other";
  }
  
  export function track(event, params = {}) {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }
  