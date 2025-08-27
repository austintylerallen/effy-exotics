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
  const inited = useRef(false);

  useEffect(() => {
    const updateHeaderVar = () => {
      const nav = document.querySelector("header.ee-header nav");
      const h = nav?.getBoundingClientRect().height ?? 80;
      document.documentElement.style.setProperty("--ee-header-h", `${Math.round(h)}px`);
    };
    updateHeaderVar();
    const id = setInterval(updateHeaderVar, 250);
    setTimeout(() => clearInterval(id), 1200);
    window.addEventListener("resize", updateHeaderVar);
    window.addEventListener("load", updateHeaderVar);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", updateHeaderVar);
      window.removeEventListener("load", updateHeaderVar);
    };
  }, []);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    // Clean any previous embeds/scripts
    const kill = () => {
      [
        '#dutchie-embed',
        'script#dutchie--embed__script',
        '[id^="dutchie--embed"]',
        '[id^="dutchie-embed"]',
        '.dutchie-embedded-menu',
        '.dutchie-embed-container'
      ].forEach(sel =>
        document.querySelectorAll(sel).forEach(el => el.remove())
      );
    };
    kill();

    if (document.querySelector('#dutchie-embed, [id^="dutchie--embed"]')) {
      setLoading(false);
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "dutchie-embed-wrapper";
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
      s.remove();
      wrapper.remove();
      kill();
      inited.current = false;
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
        <div id="dutchie-container" />
      </main>
    </>
  );
}
