import { useEffect, useState } from "react";
import Link   from "next/link";
import Image  from "next/image";
import { useRouter } from "next/router";
import { useAuth }   from "../context/AuthContext";

/* ---------- helpers ------------------------------------------------- */
const ONE_DAY = 86400;
const SIX_MO  = 180 * ONE_DAY;

function setCityCookie(city) {
  if (typeof document === "undefined") return;
  document.cookie = `ee_city=${city}; path=/; max-age=${SIX_MO}; SameSite=Lax`;
}
function getCityFromCookie() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
  return m ? m[1] : "";
}
function getCityFromPath(path) {
  if (path.startsWith("/las-cruces"))  return "las-cruces";
  if (path.startsWith("/alamogordo"))  return "alamogordo";
  return "";
}
/* -------------------------------------------------------------------- */

export default function Header() {
  const router                        = useRouter();
  const { pathname, asPath, push }    = router;
  const { user }                      = useAuth() || {};   // admin only

  /* which city? ------------------------------------------------------- */
  const pathCity   = getCityFromPath(pathname);
  const [cookieCity, setCookieCity] = useState("");
  useEffect(() => setCookieCity(getCityFromCookie()), []);
  const city = pathCity || cookieCity || "las-cruces";

  const prefix     = city === "las-cruces"   ? "/las-cruces"
                   : city === "alamogordo"   ? "/alamogordo" : "";
  const href       = (p) => `${prefix}${p}`;
  const brandHref  = prefix || "/";

  /* switcher action --------------------------------------------------- */
  const switchTo = (target) => {
    setCityCookie(target);
    const newPath = asPath.replace(/^\/(las\-cruces|alamogordo)/, `/${target}`);
    push(newPath);
  };

  /* mobile drawer toggle --------------------------------------------- */
  const [open, setOpen] = useState(false);

  /* --------------------------- JSX ---------------------------------- */
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

          {/* CITY SWITCHER (desktop) */}
          <div className="location-switcher">
            <button
              onClick={() => switchTo("las-cruces")}
              className={city === "las-cruces" ? "active" : ""}
            >
              Las Cruces
            </button>
            {" | "}
            <button
              onClick={() => switchTo("alamogordo")}
              className={city === "alamogordo" ? "active" : ""}
            >
              Alamogordo
            </button>
          </div>

          {/* DESKTOP NAV LINKS */}
          <ul className="nav-links">
            <li><Link href={href("/shop")}>TrapHouse</Link></li>
            <li><Link href={href("/about")}>About</Link></li>
            <li><Link href={href("/the-lab")}>The&nbsp;Lab</Link></li>
            <li><Link href={href("/map")}>Directions</Link></li>
            <li><Link href={href("/faq")}>FAQ</Link></li>
            {user?.isAdmin && <li><Link href="/admin">Admin</Link></li>}
          </ul>
        </div>

        {/* HAMBURGER (mobile) */}
        <button
          className="menu-btn"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className="hamburger">
            <span className="line" /><span className="line" /><span className="line" />
          </span>
          <span className="menu-text">menu</span>
        </button>
      </nav>

      {/* MOBILE SLIDE-IN MENU */}
      <div className={`mobile-menu${open ? " active" : ""}`} aria-hidden={!open}>
        <button
          className="menu-btn nav-menu-btn"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >X</button>

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

          {/* mobile links (same order) */}
          <li className="menu-link"><Link href={href("/shop")}   onClick={() => setOpen(false)}>TRAPHOUSE</Link></li>
          <li className="menu-link"><Link href={href("/about")}  onClick={() => setOpen(false)}>ABOUT</Link></li>
          <li className="menu-link"><Link href={href("/the-lab")}onClick={() => setOpen(false)}>THE LAB</Link></li>
          <li className="menu-link"><Link href={href("/map")}    onClick={() => setOpen(false)}>DIRECTIONS</Link></li>
          <li className="menu-link"><Link href={href("/faq")}    onClick={() => setOpen(false)}>FAQ</Link></li>
          {user?.isAdmin && (
            <li className="menu-link"><Link href="/admin" onClick={() => setOpen(false)}>ADMIN</Link></li>
          )}

          {/* city switcher (mobile) */}
          <li style={{ marginTop: 32 }}>
            <button onClick={() => switchTo("las-cruces")}  style={{ background:"none",border:0,color:"#fff",cursor:"pointer" }}>
              Las Cruces
            </button>{" | "}
            <button onClick={() => switchTo("alamogordo")} style={{ background:"none",border:0,color:"#fff",cursor:"pointer" }}>
              Alamogordo
            </button>
          </li>

          <li className="menu-copywrite">
            <span>2024 EFFY EXOTICS.</span> <span>All rights reserved.</span>
          </li>
        </ul>
      </div>
    </header>
  );
}
