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

  /* city-specific info (E.164 tel and pretty tel) */
  const cityInfo = {
    "alamogordo": {
      base:  "/alamogordo",
      addr:  "1408 Black St, Alamogordo, NM 88310",
      tel:   "+15752864282",
      pretty:"575-286-4282",
      hours: "Open daily 7:00 AM – 1:00 AM",
    },
    "las-cruces": {
      base:  "/las-cruces",
      addr:  "2153 W Picacho Ave, Las Cruces, NM 88077",
      tel:   "+15756524619",
      pretty:"575-652-4619",
      hours: "", // Hours are pulled dynamically on pages; omit here
    },
  };

  const info = cityInfo[city] || cityInfo["las-cruces"];
  const gmapsDest = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(info.addr)}`;

  /* switch between locations (safe even if current path isn't location-scoped) */
  const switchTo = (target) => {
    setCity(target);
    setCityCookie(target);
    const targetBase = target === "alamogordo" ? "/alamogordo" : "/las-cruces";
    const next = asPath.replace(/^\/(las\-cruces|alamogordo)/, targetBase);
    push(next === asPath ? targetBase : next);
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
          {info.hours ? (
            <>
              <br />
              🕒 {info.hours}
            </>
          ) : null}
          <br />
          📞 <a href={`tel:${info.tel}`}>{info.pretty}</a>
          <br />
          📍{" "}
          <a href={gmapsDest} target="_blank" rel="noopener noreferrer">
            Directions
          </a>
        </address>

        {/* Legal */}
        <small className="footer-copy">
          © {new Date().getFullYear()} Effy Exotics. All rights reserved.
          <br />
          Content and graphics are protected by copyright and other intellectual-property laws.
        </small>

        {/* City switcher */}
        <nav className="footer-switch" aria-label="Switch location">
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
