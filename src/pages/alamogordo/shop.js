import { useEffect, useState } from "react";
import Head from "next/head";
import { gaEvent } from "../../lib/gtag";

export default function ShopPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // remove any previous instance (when navigating back/forth)
    document.querySelectorAll('#dutchie-embed, script#dutchie--embed__script').forEach(el => el.remove());
    document.querySelectorAll('[id^="dutchie--embed"]').forEach(el => el.remove());

    const s = document.createElement("script");
    s.id = "dutchie--embed__script";
    s.async = true;
    s.src = "https://dutchie.com/api/v2/embedded-menu/66b662a0d91b92addb39e11a.js"; // update this if Alamogordo has a separate Dutchie menu
    s.onload = () => {
      setLoading(false);

      // ✅ Fire GA event when menu loads
      gaEvent("view_shop_menu", {
        page_location: window.location.href,
      });
    };
    document.body.appendChild(s);   

    return () => {
      s.remove();
      document.querySelectorAll('[id^="dutchie--embed"]').forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Shop Cannabis | Effy Exotics Alamogordo</title>
        <meta
          name="description"
          content="Browse premium cannabis products available at Effy Exotics in Alamogordo, NM. Flower, vapes, edibles, and more—now in stock."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="menu" style={{ minHeight: 600, paddingTop: 24 }}>
        {loading && <p style={{ textAlign: "center" }}>Loading menu…</p>}
        <div id="dutchie-container" />
      </main>
    </>
  );
}
