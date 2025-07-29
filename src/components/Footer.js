// src/components/Footer.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function baseFromPath(pathname) {
  if (pathname.startsWith("/las-cruces")) return "/las-cruces";
  if (pathname.startsWith("/alamogordo")) return "/alamogordo";
  return "";
}

function baseFromCookie() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
  return m ? `/${m[1]}` : "";
}

export default function Footer() {
  const { pathname } = useRouter();

  // Prefer pathname (works on first render); cookie as client fallback
  const pathnameBase = baseFromPath(pathname);
  const [cookieBase, setCookieBase] = useState("");
  useEffect(() => setCookieBase(baseFromCookie()), []);

  const base = pathnameBase || cookieBase || "/";

  return (
    <footer>
      <Link href={base} className="link-n-logo" aria-label="Effy Exotics Home">
        <Image
          src="/img/effy-dispensary.svg"
          alt="Effy Exotics logo"
          width={160}
          height={160}
          priority={false}
          style={{ margin: "auto" }}
        />
      </Link>

      <p className="copyright">
        ©2024 EFFY EXOTICS.<br />All rights reserved.
      </p>

      <p className="trademark">
        The content, design, graphics, and other materials on this website are protected by
        copyright and other intellectual property laws. Any unauthorized reproduction,
        distribution, or modification is strictly prohibited.
      </p>
    </footer>
  );
}
