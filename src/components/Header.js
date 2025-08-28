// src/components/Header.jsx
import { useEffect, useState } from "react";
import Link   from "next/link";
import Image  from "next/image";
import { useRouter } from "next/router";
import { useAuth }   from "../context/AuthContext";
import { track }     from "../lib/track";
import { ALAMO_ADDR } from "../config/alamogordo.constants";

/* ─── helpers ───────────────────────────────────────────────────── */
const ONE_DAY   = 86_400;
const SIX_MO    = 180 * ONE_DAY;
const COOKIE_RE = /(?:^|;\s*)ee_city=(las-cruces|alamogordo)/;

const setCityCookie = (city) => {
  if (typeof document !== "undefined") {
    document.cookie = `ee_city=${city}; path=/; max-age=${SIX_MO}; SameSite=Lax`;
  }
};
const getCityFromCookie = () => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(COOKIE_RE);
  return m ? m[1] : "";
};
const getCityFromPath = (path = "") => {
  if (path.startsWith("/las-cruces")) return "las-cruces";
  if (path.startsWith("/alamogordo")) return "alamogordo";
  return "";
};
/* ──────────────────────────────────────────────────────────────── */

export default function Header() {
  const router                     = useRouter();
  const { pathname, asPath, push } = router;
  const { user }                   = useAuth() || {}; // admin only

  /* ── active city -------------------------------------------------- */
  const pathCity                    = getCityFromPath(pathname);
  const [cookieCity, setCookieCity] = useState("");
  useEffect(() => setCookieCity(getCityFromCookie()), []);

  const city   = pathCity || cookieCity || "las-cruces";
  const prefix =
    city === "las-cruces" ? "/las-cruces" :
    city === "alamogordo" ? "/alamogordo" :
    "";

  const href      = (p) => `${prefix}${p}`;
  const brandHref = prefix || "/";

  const switchTo = (target) => {
    setCityCookie(target);
    const newPath = asPath.replace(/^\/(las\-cruces|alamogordo)/, `/${target}`);
    push(newPath);
  };

  /* ── drawer state ------------------------------------------------- */
  const [open, setOpen] = useState(false);

  /* close drawer on route change ----------------------------------- */
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart",    close);
    router.events.on("routeChangeComplete", close);
    router.events.on("routeChangeError",    close);
    return () => {
      router.events.off("routeChangeStart",    close);
      router.events.off("routeChangeComplete", close);
      router.events.off("routeChangeError",    close);
    };
  }, [router.events]);

  /* close drawer whenever viewport is ≥1200px ---------------------- */
  useEffect(() => {
    const closeIfWide = () => {
      if (window.innerWidth >= 1200) setOpen(false);
    };
    window.addEventListener("resize", closeIfWide);
    return () => window.removeEventListener("resize", closeIfWide);
  }, []);

  // ────────────────────────────────────────────────────────────────
  // TRAPHOUSE — city-aware routing
  //  - Las Cruces: live Dutchie shop
  //  - Alamogordo: Coming Soon page (at /alamogordo/shop)
  const trapHouseHref =
    city === "las-cruces" ? href("/shop") : "/alamogordo/shop";
  // ────────────────────────────────────────────────────────────────

  // City addresses for directions tracking
  const addressMap = {
    "las-cruces": "2153 W Picacho Ave, Las Cruces, NM 88007",
    "alamogordo": ALAMO_ADDR || undefined,
  };

  // ── tracking helpers
  const onShop = () => {
    track("shop_click", { location: city, dest: trapHouseHref });
  };

  const onVisit = () => {
    const dest = href("/map");
    track("directions_click", {
      location: city,
      address: addressMap[city],
      dest,
    });
  };

  return (
    <header className="ee-header">
      <nav>
        <div className="nav-links-n-logo">
          {/* logo */}
          <Link href={brandHref} className="brand" aria-label="Effy Exotics Home">
            <Image
              src="/img/effy-dispensary.svg"
              alt="Effy Exotics logo"
              width={140}
              height={40}
              priority
            />
          </Link>

          {/* desktop city switcher */}
          <div className="location-switcher">
            <button
              onClick={() => switchTo("las-cruces")}
              className={city === "las-cruces" ? "active" : undefined}
            >
              Las Cruces
            </button>
            <span className="switch-sep">|</span>
            <button
              onClick={() => switchTo("alamogordo")}
              className={city === "alamogordo" ? "active" : undefined}
            >
              Alamogordo
            </button>
          </div>

          {/* desktop navigation */}
          <ul className="nav-links">
            <li>
              <Link href={trapHouseHref} onClick={onShop}>
                TrapHouse
              </Link>
            </li>
            <li>
              <Link href={href("/about")}>About</Link>
            </li>
            <li>
              <Link href={href("/the-lab")}>The Lab</Link>
            </li>
            <li>
              <Link href={href("/map")} onClick={onVisit}>
                Visit Us
              </Link>
            </li>
            <li>
              <Link href={href("/faq")}>FAQ</Link>
            </li>
            {user?.isAdmin && (
              <li>
                <Link href="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </div>

        {/* hamburger */}
        <button
          className="menu-btn"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </span>
          <span className="menu-text">menu</span>
        </button>
      </nav>

      {/* mobile drawer */}
      <div className={`mobile-menu${open ? " active" : ""}`} aria-hidden={!open}>
        <button
          className="menu-btn nav-menu-btn"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <ul className="menu-list">
          <li className="menu-logo">
            <Link href={brandHref} onClick={() => setOpen(false)}>
              <Image
                src="/img/effy-dispensary.svg"
                alt="Effy Exotics logo"
                width={140}
                height={40}
                priority
              />
            </Link>
          </li>

          {/* TRAPHOUSE — tracked */}
          <li className="menu-link">
            <Link
              href={trapHouseHref}
              onClick={() => {
                onShop();
                setOpen(false);
              }}
            >
              TRAPHOUSE
            </Link>
          </li>

          <li className="menu-link">
            <Link href={href("/about")} onClick={() => setOpen(false)}>
              ABOUT
            </Link>
          </li>

          <li className="menu-link">
            <Link href={href("/the-lab")} onClick={() => setOpen(false)}>
              THE LAB
            </Link>
          </li>

          {/* VISIT US — tracked */}
          <li className="menu-link">
            <Link
              href={href("/map")}
              onClick={() => {
                onVisit();
                setOpen(false);
              }}
            >
              VISIT US
            </Link>
          </li>

          <li className="menu-link">
            <Link href={href("/faq")} onClick={() => setOpen(false)}>
              FAQ
            </Link>
          </li>

          {user?.isAdmin && (
            <li className="menu-link">
              <Link href="/admin" onClick={() => setOpen(false)}>
                ADMIN
              </Link>
            </li>
          )}

          {/* mobile city switcher */}
          <li style={{ marginTop: 32 }} className="city-switcher">
            <button
              onClick={() => {
                switchTo("las-cruces");
                setOpen(false);
              }}
              className={`city-switcher-btn ${city === "las-cruces" ? "active" : ""}`}
            >
              Las Cruces
            </button>
            <span className="switch-sep">|</span>
            <button
              onClick={() => {
                switchTo("alamogordo");
                setOpen(false);
              }}
              className={`city-switcher-btn ${city === "alamogordo" ? "active" : ""}`}
            >
              Alamogordo
            </button>
          </li>

          <li className="menu-copywrite">
            2024&nbsp;EFFY&nbsp;EXOTICS.&nbsp;All&nbsp;rights&nbsp;reserved.
          </li>
        </ul>
      </div>
    </header>
  );
}
