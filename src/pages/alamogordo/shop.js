// // src/pages/alamogordo/shop.js
// import { useEffect, useRef, useState } from "react";
// import Header from "../../components/Header";
// import SEO from "../../components/SEO";
// import styles from "./shop.module.css";
// import { track as realTrack } from "../../lib/track";

// const CANON = "https://www.effyexotics.com/alamogordo/shop";
// const ALAMO_EMBED_ID = "688904f4ca54c616139353b0";
// const track = typeof realTrack === "function" ? realTrack : () => {};

// export default function AlamogordoShop() {
//   const [loading, setLoading] = useState(true);
//   const inited = useRef(false); // prevent double-inject in StrictMode

//   // keep CSS var for header height current
//   useEffect(() => {
//     const updateHeaderVar = () => {
//       const nav = document.querySelector("header.ee-header nav");
//       const h = nav?.getBoundingClientRect().height ?? 80;
//       document.documentElement.style.setProperty("--ee-header-h", `${Math.round(h)}px`);
//     };
//     updateHeaderVar();
//     const id = setInterval(updateHeaderVar, 250);
//     setTimeout(() => clearInterval(id), 1200);
//     window.addEventListener("resize", updateHeaderVar);
//     window.addEventListener("load", updateHeaderVar);
//     return () => {
//       clearInterval(id);
//       window.removeEventListener("resize", updateHeaderVar);
//       window.removeEventListener("load", updateHeaderVar);
//     };
//   }, []);

//   useEffect(() => {
//     if (inited.current) return; // already initialized for this mount
//     inited.current = true;

//     track("shop_view", { location: "alamogordo", page: "/alamogordo/shop" });

//     // Hard cleanup of any prior Dutchie embeds/scripts
//     const kill = () => {
//       [
//         '#dutchie-embed',
//         'script#dutchie--embed__script',
//         '[id^="dutchie--embed"]',
//         '[id^="dutchie-embed"]',
//         '.dutchie-embedded-menu',
//         '.dutchie-embed-container'
//       ].forEach(sel =>
//         document.querySelectorAll(sel).forEach(el => el.remove())
//       );
//     };
//     kill();

//     // Avoid duplicate if something already injected
//     if (document.querySelector('#dutchie-embed, [id^="dutchie--embed"]')) {
//       setLoading(false);
//       return;
//     }

//     // Create a local wrapper so we can target/remove cleanly
//     const wrapper = document.createElement("div");
//     wrapper.id = "dutchie-embed-wrapper";
//     document.body.appendChild(wrapper);

//     const s = document.createElement("script");
//     s.id = "dutchie--embed__script";
//     s.async = true;
//     s.src = `https://dutchie.com/api/v2/embedded-menu/${ALAMO_EMBED_ID}.js`;
//     s.onload = () => {
//       setLoading(false);
//       track("view_shop_menu", { city: "alamogordo", page_location: window.location.href });
//     };
//     wrapper.appendChild(s);

//     return () => {
//       // cleanup on unmount
//       s.remove();
//       wrapper.remove();
//       kill();
//       inited.current = false;
//     };
//   }, []);

//   return (
//     <>
//       <SEO
//         title="TrapHouse – Alamogordo | Effy Exotics"
//         description="Browse Effy Exotics — Alamogordo (TrapHouse) menu and order online for pickup."
//         canonical={CANON}
//         image="/img/social-preview.jpg"
//         noindex={false}
//       />
//       <Header />
//       <main className={styles.container}>
//         {loading && <p style={{ textAlign: "center" }}>Loading menu…</p>}
//         {/* Dutchie injects into body; this container is just fine to keep */}
//         <div id="dutchie-container" />
//       </main>
//     </>
//   );
// }



// src/pages/alamogordo/shop.js
// Temporarily route Alamogordo's shop to the global Coming Soon page.
// Las Cruces remains live.

export async function getServerSideProps() {
  return {
    redirect: { destination: "/coming-soon", permanent: false },
  };
}

export default function AlamogordoShopRedirect() {
  // Nothing to render; Next.js performs a server-side redirect.
  return null;
}
