import { useEffect, useState } from "react";
import Link   from "next/link";
import Image  from "next/image";
import { useRouter } from "next/router";

/* ─── helpers for city detection / cookie ─────────────────────────── */
const SIX_MO = 180 * 86400;
const setCityCookie = (c) => {
  if (typeof document !== "undefined")
    document.cookie = `ee_city=${c}; path=/; max-age=${SIX_MO}; SameSite=Lax`;
};
const getCityCookie = () => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
  return m ? m[1] : "";
};
const cityFromPath = (path) =>
  path.startsWith("/alamogordo") ? "alamogordo"
  : path.startsWith("/las-cruces") ? "las-cruces"
  : "";

/* ─────────────────────────────────────────────────────────────────── */
export default function Footer() {
  const { pathname, asPath, push } = useRouter();
  const [city, setCity] = useState(() => cityFromPath(pathname) || getCityCookie() || "las-cruces");

  /* city-specific info */
  const info = city === "alamogordo"
    ? { base:"/alamogordo", addr:"1408 Black St, Alamogordo, NM 88310", tel:"TBD", pretty:"Coming Soon" }
    : { base:"/las-cruces", addr:"2153 W Picacho Ave, Las Cruces, NM 88077", tel:"+15756524619", pretty:"575-652-4619" };

  /* switch between locations */
  const switchTo = (target) => {
    setCity(target);
    setCityCookie(target);
    push(asPath.replace(/^\/(las\-cruces|alamogordo)/, `/${target}`));
  };

  return (
    <footer className="ee-footer">
      <div className="footer-inner">
        {/* Brand mark */}
        <Link href={info.base} aria-label="Effy Exotics Home">
          <Image
            src="/img/effy-dispensary.svg"
            alt="Effy Exotics logo"
            width={120}
            height={120}
            priority={false}
          />
        </Link>

        {/* Address + phone */}
        <address className="footer-contact">
          {info.addr}
          <br />
          📞{" "}
          {info.tel === "TBD" ? (
            info.pretty
          ) : (
            <a href={`tel:${info.tel}`}>{info.pretty}</a>
          )}
        </address>

        {/* Legal */}
        <small className="footer-copy">
          © 2024 Effy Exotics. All rights reserved.
          <br />
          Content and graphics are protected by copyright and other intellectual-property laws.
        </small>

        {/* City switcher */}
        <nav className="footer-switch">
          <button
            onClick={() => switchTo("las-cruces")}
            className={city === "las-cruces" ? "active" : ""}
          >
            Las Cruces
          </button>
          <span> | </span>
          <button
            onClick={() => switchTo("alamogordo")}
            className={city === "alamogordo" ? "active" : ""}
          >
            Alamogordo
          </button>
        </nav>
      </div>
    </footer>
  );
}
