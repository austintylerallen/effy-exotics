// src/pages/las-cruces/shop.js
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import styles from "./shop.module.css";
import { track as realTrack } from "../../lib/track";

const track = typeof realTrack === "function" ? realTrack : () => {};
const LC_EMBED_ID = "66b662a0d91b92addb39e11a";

export default function LasCrucesShop() {
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  // keep CSS var for nav height current
  useEffect(() => {
    const update = () => {
      const nav = document.querySelector("header.ee-header nav");
      const h = nav?.getBoundingClientRect().height ?? 80;
      document.documentElement.style.setProperty("--ee-header-h", `${Math.round(h)}px`);
    };
    update();
    const id = setInterval(update, 250);
    setTimeout(() => clearInterval(id), 1200);
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // global “only once” guard for LC
    if (typeof window !== "undefined" && window.__EE_DUTCHIE_LC_ACTIVE) {
      // already injected this session
      setLoading(false);
      return;
    }

    const killAllDutchie = () => {
      const selectors = [
        '#dutchie-embed',
        'script#dutchie--embed__script',
        '[id^="dutchie--embed"]',
        '[id^="dutchie-embed"]',
        '.dutchie-embedded-menu',
        '.dutchie-embed-container'
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
      // any stray Dutchie embed script by src
      document
        .querySelectorAll('script[src*="dutchie.com/api/v2/embedded-menu"]')
        .forEach((el) => el.remove());
    };

    killAllDutchie();

    // set global flag before injecting to stop races
    if (typeof window !== "undefined") window.__EE_DUTCHIE_LC_ACTIVE = true;

    // dedicated wrapper so cleanup is trivial
    const wrapper = document.createElement("div");
    wrapper.id = "ee-dutchie-lc-wrapper";
    document.body.appendChild(wrapper);

    const s = document.createElement("script");
    s.id = "dutchie--embed__script";
    s.async = true;
    s.src = `https://dutchie.com/api/v2/embedded-menu/${LC_EMBED_ID}.js`;
    s.onload = () => {
      setLoading(false);
      track("view_shop_menu", { city: "las-cruces", page_location: window.location.href });
    };
    wrapper.appendChild(s);

    return () => {
      // cleanup and unlock
      s.remove();
      wrapper.remove();
      killAllDutchie();
      if (typeof window !== "undefined") delete window.__EE_DUTCHIE_LC_ACTIVE;
      mounted.current = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>TrapHouse – Las Cruces | Effy Exotics</title>
        <meta name="robots" content="index, follow" />
      </Head>
      <Header />
      <main className={styles.container}>
        {loading && <p style={{ textAlign: "center" }}>Loading menu…</p>}
      </main>
    </>
  );
}
