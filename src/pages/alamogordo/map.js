// =============================================================
// src/pages/alamogordo/map.js
// =============================================================
import Header  from "../../components/Header";
import Footer  from "../../components/Footer";
import SEO     from "../../components/SEO";
import Image   from "next/image";

/* ---- location constants ------------------------------------------- */
import {
  ALAMO_ADDR,
  ALAMO_TEL,
  ALAMO_TEL_PRETTY,
  ALAMO_CANON,
  ALAMO_IMG,
} from "../../config/alamogordo.constants";

export default function MapPage() {
  const embedSrc =
    "https://www.google.com/maps?q=1408+Black+St,+Alamogordo,+NM+88310&output=embed";

  return (
    <>
      <SEO
        title="Directions & Map — Alamogordo"
        description="Get directions to Effy Exotics in Alamogordo, NM and view store hours."
        image={ALAMO_IMG}
        canonical={`${ALAMO_CANON}/map`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CannabisDispensary",
            "@id": `${ALAMO_CANON}/#store-alamogordo`,
            name: "Effy Exotics — Alamogordo",
            url: ALAMO_CANON,
            telephone: ALAMO_TEL,
            address: {
              "@type": "PostalAddress",
              streetAddress: "1408 Black St",
              addressLocality: "Alamogordo",
              addressRegion: "NM",
              postalCode: "88310",
              addressCountry: "US",
            },
            hasMap: embedSrc,
          },
        ]}
      />

      <Header />

      <main className="map page">
        {/* ─── hero banner ─────────────────────────────────────── */}
        <section className="map-hero">
          <Image
            src="/img/directions1200.jpeg"
            alt="Effy Exotics Alamogordo exterior"
            className="banner-img"
            fill
            priority
            sizes="100vw"
          />
        </section>

        {/* ─── live Google Map ─────────────────────────────────── */}
        <section className="map-embed" aria-label="Effy Exotics on Google Maps">
          <div className="map-embed__ratio">
            <iframe
              title="Effy Exotics (Alamogordo) on Google Maps"
              src={embedSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ─── text block ─────────────────────────────────────── */}
        <section className="int-main-section">
          <h1>Directions</h1>
          <div>
            <Image
              className="icon"
              src="/img/effy-dispensary.svg"
              alt="Effy Exotics icon"
              width={48}
              height={48}
            />

            <div className="map-text">
              <h2>New Mexico&apos;s Hottest Dispensary</h2>
              <p>{ALAMO_ADDR}</p>

              <a
                href={ALAMO_TEL === "TBD" ? "#" : `tel:${ALAMO_TEL}`}
                style={{ color: "#C09B31", textDecoration: "none" }}
              >
                {ALAMO_TEL_PRETTY}
              </a>

              <h2 style={{ marginTop: 24 }}>Dispensary Hours</h2>
              <p>
                Saturday&nbsp;7 AM – 11:30 PM<br />
                Sunday&nbsp;10 AM – 11:30 PM<br />
                Mon––Fri&nbsp;7 AM – 11:30 PM
              </p>

              <p style={{ marginTop: 24 }}>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    ALAMO_ADDR
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#C09B31", textDecoration: "none" }}
                >
                  Open in Google Maps →
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
