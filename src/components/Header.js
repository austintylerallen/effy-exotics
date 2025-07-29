// src/components/Header.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

function getCookieCity() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
  return m ? `/${m[1]}` : "";
}

export default function Header() {
  const { pathname, asPath, push } = useRouter();
  const { user, signOutUser } = useAuth() || {};

  // Prefer pathname (SSR), then cookie (client)
  const pathnameBase =
    pathname.startsWith("/las-cruces") ? "/las-cruces"
    : pathname.startsWith("/alamogordo") ? "/alamogordo"
    : "";

  const [cookieBase, setCookieBase] = useState("");
  useEffect(() => setCookieBase(getCookieCity()), []);
  const base = pathnameBase || cookieBase;

  // Helper to prefix internal (city) routes
  const href = (path) => (base ? `${base}${path}` : path);
  const brandHref = base || "/";

  // Auth links are absolute (no city prefix) + return to current page
  const nextParam = `?next=${encodeURIComponent(asPath || "/")}`;
  const loginHref = `/login${nextParam}`;
  const accountHref = `/account${nextParam}`;

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser?.();
      setOpen(false);
      push(asPath || "/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header>
      <nav>
        <div className="nav-links-n-logo">
          <Link href={brandHref} className="brand">
            <img src="/img/effy-dispensary.svg" alt="Effy Logo" />
          </Link>

          <ul className="nav-links">
            <li><Link href={href("/shop")}>TrapHouse</Link></li>
            <li><Link href={href("/about")}>About Us</Link></li>
            <li><Link href={href("/the-lab")}>The Lab</Link></li>
            <li><Link href={href("/map")}>Directions</Link></li>
            <li><Link href={href("/faq")}>FAQ</Link></li>

            {/* Auth (desktop) */}
            {!user ? (
              <li><Link href={loginHref}>Login</Link></li>
            ) : (
              <>
                <li><Link href={accountHref}>Account</Link></li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
          <span className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </span>
          <span className="menu-text">menu</span>
        </button>
      </nav>

      {/* Slide-in mobile menu */}
      <div className={`mobile-menu${open ? " active" : ""}`} aria-hidden={!open}>
        <button className="menu-btn nav-menu-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
          X
        </button>

        <ul className="menu-list">
          <li className="menu-logo">
            <Link href={brandHref} className="brand" onClick={() => setOpen(false)}>
              <Image src="/img/effy-dispensary.svg" alt="Effy Logo" width={140} height={40} priority />
            </Link>
          </li>

          <li className="menu-link"><Link href={href("/shop")} onClick={() => setOpen(false)}>TRAPHOUSE</Link></li>
          <li className="menu-link"><Link href={href("/about")} onClick={() => setOpen(false)}>ABOUT US</Link></li>
          <li className="menu-link"><Link href={href("/the-lab")} onClick={() => setOpen(false)}>THE LAB</Link></li>
          <li className="menu-link"><Link href={href("/map")} onClick={() => setOpen(false)}>DIRECTIONS</Link></li>
          <li className="menu-link"><Link href={href("/faq")} onClick={() => setOpen(false)}>FAQ</Link></li>

          {/* Auth (mobile) */}
          {!user ? (
            <li className="menu-link">
              <Link href={loginHref} onClick={() => setOpen(false)}>LOGIN</Link>
            </li>
          ) : (
            <>
              <li className="menu-link">
                <Link href={accountHref} onClick={() => setOpen(false)}>ACCOUNT</Link>
              </li>
              <li className="menu-link">
                <a
                  href="#logout"
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                >
                  LOGOUT
                </a>
              </li>
            </>
          )}

          <li className="menu-copywrite">
            <span>2024 EFFY EXOTICS.</span> <span>All rights reserved.</span>
          </li>
        </ul>
      </div>
    </header>
  );
}
