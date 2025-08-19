export function track(event, params = {}) {
    if (typeof window === "undefined") return;
    try { if (window.gtag) window.gtag("event", event, params); } catch {}
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...params });
    } catch {}
  }
  