// src/pages/alamogordo/shop.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO    from "../../components/SEO";
import { useEffect } from "react";
import { track } from "../../lib/analytics";

const CANON = "https://www.effyexotics.com/alamogordo/shop";

export default function AlamogordoShop() {
  useEffect(() => {
    track("shop_view", { location: "alamogordo", page: "/alamogordo/shop" });
  }, []);

  return (
    <>
      <SEO
        title="Shop Cannabis Online in Alamogordo"
        description="Browse Effy Exotics — Alamogordo menu and order online for pickup. (Launching soon)"
        canonical={CANON}
        image="/img/social-preview.jpg"
        noindex={true}  // remove once live
      />
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1>Alamogordo Online Ordering</h1>
        <p>Our Alamogordo online menu is launching soon. Please check back!</p>
      </main>
      <Footer />
    </>
  );
}
