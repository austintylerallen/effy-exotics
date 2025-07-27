// src/components/Header.js
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav>
        <div className="nav-links-n-logo">
          <Link href="/" className="brand">
            <img src="/img/effy-dispensary.svg" alt="Effy Logo" />
          </Link>

          <ul className="nav-links">
            <li><Link href="/shop">TrapHouse</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/the-lab">The Lab</Link></li>
            <li><Link href="/map">Directions</Link></li>
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

      {/* Mobile menu overlay */}
      <div className={`mobile-menu${open ? " active" : ""}`} aria-hidden={!open}>
        <button className="menu-btn nav-menu-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
          X
        </button>

        <ul className="menu-list">
          <li className="menu-logo">
            <Link href="/" onClick={() => setOpen(false)}>
              <img src="/img/effy-dispensary.svg" alt="Effy Logo" />
            </Link>
          </li>
          <li className="menu-link"><Link href="/shop" onClick={() => setOpen(false)}>TrapHouse</Link></li>
          <li className="menu-link"><Link href="/about" onClick={() => setOpen(false)}>ABOUT US</Link></li>
          <li className="menu-link"><Link href="/the-lab" onClick={() => setOpen(false)}>THE LAB</Link></li>
          <li className="menu-link"><Link href="/map" onClick={() => setOpen(false)}>DIRECTIONS</Link></li>
          <li className="menu-copywrite"><span>2024 EFFY EXOTICS.</span> <span>All rights reserved.</span></li>
        </ul>
      </div>
    </header>
  );
}
