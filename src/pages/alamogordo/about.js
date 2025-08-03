// src/pages/alamogordo/about.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import SubscribeForm from "../../components/SubscribeForm";   // ← NEW

/* ---- centralized constants -------------------------------------- */
import {
  ALAMO_ADDR,
  ALAMO_TEL,
  ALAMO_TEL_PRETTY,
  ALAMO_HOURS,
  ALAMO_CANON,
  ALAMO_IMG,
} from "../../config/alamogordo.constants";

export default function About() {
  return (
    <>
      <SEO
        title="About Effy Exotics – Alamogordo"
        description="Effy Exotics brings premium cannabis to Alamogordo, NM. Learn our story, standards, and exclusive strains."
        image={ALAMO_IMG}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CannabisDispensary",
            name: "Effy Exotics — Alamogordo",
            url: ALAMO_CANON,
            telephone: ALAMO_TEL,
            openingHours: ALAMO_HOURS,
            address: {
              "@type": "PostalAddress",
              streetAddress: "1408 Black St",
              addressLocality: "Alamogordo",
              addressRegion: "NM",
              postalCode: "88310",
              addressCountry: "US",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home",  item: "https://www.effyexotics.com/" },
              { "@type": "ListItem", position: 2, name: "About", item: `${ALAMO_CANON}/about` },
            ],
          },
        ]}
      />

      <Header />

      <main className="about page">
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="top-image" aria-label="About Effy Exotics">
          <picture>
            <source media="(min-width:1200px)" srcSet="/img/about.jpeg"   />
            <source media="(min-width:768px)"  srcSet="/img/about1200.jpeg" />
            <Image
              src="/img/about767.jpeg"
              alt="About Effy Exotics"
              width={1200}
              height={675}
              priority
            />
          </picture>
        </section>

        {/* ─── Core copy ────────────────────────────────────────────── */}
        <section className="int-main-section">
          <h1>About Us</h1>

          <div>
            <Image
              className="icon"
              src="/img/effy-dispensary.svg"
              alt="Effy Exotics icon"
              width={48}
              height={48}
            />

            <div>
              <h2>New Mexico&apos;s Hottest Dispensary</h2>

              <p>
                Welcome to Effy Exotics, your premier destination for top-quality
                cannabis products in Alamogordo, New Mexico. Whether you&apos;re a
                seasoned connoisseur or exploring for the first time, we’re here to
                guide your journey.
              </p>
              <p>
                We curate an extensive selection of exotic strains, artisanal edibles,
                and clean concentrates. Every product on our shelves is vetted for
                purity, potency, and consistency—so you can shop with confidence.
              </p>
              <p>
                Visit our modern storefront at <strong>{ALAMO_ADDR}</strong> and
                discover why Effy Exotics sets the standard for service in southern
                New Mexico.
              </p>
              <p>📞 <em>{ALAMO_TEL_PRETTY}</em></p>
            </div>
          </div>
        </section>

        {/* ─── Opt-in bar (email / SMS) ────────────────────────────── */}
        <SubscribeForm />
      </main>

      <Footer />
    </>
  );
}
