import { NextResponse } from "next/server";

// Maintenance is enforced for every request, including legacy pages and data URLs.
const assets = new Set([
  "/maintenance/maintenance-hours.js",
  "/maintenance/maintenance.js",
  "/maintenance/cloud-shader.js",
  "/maintenance/maintenance.css",
  "/maintenance/age-gate.js",
  "/maintenance/THIRD_PARTY_NOTICES.txt",
  "/maintenance/cloud-atlas.js",
  "/maintenance/ordering.js",
  "/maintenance/assets/InstrumentSerif-Italic.ttf",
  "/maintenance/assets/Manrope-OFL.txt",
  "/maintenance/assets/reactbits-LICENSE.md",
  "/maintenance/assets/effy-logo-gold.svg",
  "/maintenance/assets/gsap.min.js",
  "/maintenance/assets/effy-logo-gold-mask.svg",
  "/maintenance/assets/InstrumentSerif-OFL.txt",
  "/maintenance/assets/aa-ventures-transparent.png",
  "/maintenance/assets/aa-ventures-dark.png",
  "/maintenance/assets/effy-logo.svg",
  "/maintenance/assets/LegendM54.ttf",
  "/maintenance/assets/Manrope-variable.ttf"
]);
const pages = {
  "/": "/maintenance/index.html",
  "/las-cruces/shop": "/maintenance/las-cruces.html",
  "/alamogordo/shop": "/maintenance/alamogordo.html",
};
export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  let response;
  if (pages[pathname]) {
    url.pathname = pages[pathname];
    response = NextResponse.rewrite(url);
  } else if (pathname === "/api/store-hours" || assets.has(pathname) || pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    response = NextResponse.next();
  } else if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    response = new NextResponse(null, { status: 404 });
  } else {
    url.pathname = "/";
    url.search = "";
    response = NextResponse.redirect(url, 307);
  }
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = { matcher: "/:path*" };
