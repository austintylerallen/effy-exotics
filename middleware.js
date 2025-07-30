import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  const city = req.cookies.get("ee_city")?.value;
  const ageVerified = req.cookies.get("ageVerified")?.value === "true";

  // Require age verification for location sections
  const isLocationPath =
    pathname.startsWith("/las-cruces") || pathname.startsWith("/alamogordo");

  if (isLocationPath && !ageVerified) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If on landing ("/") and we already know the city, send them there
  if (pathname === "/" && city) {
    url.pathname = city === "alamogordo" ? "/alamogordo" : "/las-cruces";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/las-cruces/:path*", "/alamogordo/:path*"],
};
