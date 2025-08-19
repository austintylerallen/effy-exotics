// src/pages/las-cruces/map.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import OpeningHours  from "../../components/OpeningHours";
import { track }     from "../../lib/track";

export default function MapPage() {
  /* ── page constants ───────────────────────────────────────────── */
  const addressLine = "2153 W Picacho Ave, Las Cruces, NM 88077";

  // phone in both pretty + digits/E.164 for tracking + tel:
  const telPretty   = "575-652-4619";
  const phoneDigits = "5756524619";
  const telHref     = `+1${phoneDigits}`;

  const canonical = "https://www.effyexotics.com/las-cruces/map";
  const embedSrc  =
    "https://www.google.com/maps?q=2153+W+Picacho+Ave,+Las+Cruces,+NM+88077&output=embed";
  const gmapsDest =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine)}`;

  /* ── tracking handlers ────────────────────────────────────────── */
  const onCall = () => {
    track("call_click", {
      location: "las-cruces",
      phone: phoneDigits,
      dest: `tel:${telHref}`,
    });
  };

  const onDirections = () => {
    track("directions_click", {
      location: "las-cruces",
      address: addressLine,
      dest: gmapsDest,
    });
  };

  /* ── structured-data / breadcrumbs (unchanged) ───────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CannabisDispensary",
      "@id": "https://www.effyexotics.com/las-cruces/#store-las-cruces",
      name: "Effy Exotics — Las Cruces",
      url: "https://www.effyexotics.com/las-cruces",
      image: "https://www.effyexotics.com/img/effy-dispensary.svg",
      telephone: "+1-575-652-4619",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2153 W Picacho Ave",
        addressLocality: "Las Cruces",
        addressRegion: "NM",
        postalCode: "88077",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.311383948399154,
        longitude: -106.80641921326792,
      },
      hasMap: embedSrc,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.effyexotics.com/" },
        { "@type": "ListItem", position: 2, name: "Las Cruces", item: "https://www.effyexotics.com/las-cruces" },
        { "@type": "ListItem", position: 3, name: "Directions", item: canonical }
      ],
    },
  ];

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <>
      <SEO
        title="Directions & Map — Las Cruces"
        description="Find Effy Exotics in Las Cruces, NM. Get directions, view our location on Google Maps, and see store hours."
        image="/img/social-preview.jpg"
        type="website"
        jsonLd={jsonLd}
        canonical={canonical}
      />

      <Header />

      <main className="map page">
        {/* ─── Hero banner ─────────────────────────────────────────── */}
        <section className="map-hero" aria-label="Location banner">
          <Image
            src="/img/directions1200.jpeg"
            alt="Effy Exotics – find us in Las Cruces"
            fill
            priority
            className="banner-img"
          />
        </section>

        {/* ─── Google Map embed ─────────────────────────────────── */}
        <section className="map-embed" aria-label="Map">
          <div className="map-embed__ratio">
            <iframe
              title="Effy Exotics Location"
              src={embedSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ─── Info panel ───────────────────────────────────────── */}
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
              <h2>New&nbsp;Mexico&apos;s&nbsp;Hottest&nbsp;Dispensary</h2>
              <p>{addressLine}</p>

              {/* CALL — fires call_click */}
              <a
                href={`tel:${telHref}`}
                onClick={onCall}
                style={{ color: "#C09B31", textDecoration: "none" }}
              >
                {telPretty}
              </a>

              <h2 style={{ marginTop: 24 }}>Dispensary Hours</h2>
              <OpeningHours placeId="ChIJb71bdzE93oYR992nSQCWrZA" />

              {/* DIRECTIONS — fires directions_click */}
              <p style={{ marginTop: 24 }}>
                <a
                  href={gmapsDest}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onDirections}
                  style={{ color: "#C09B31", textDecoration: "none" }}
                >
                  Open&nbsp;in&nbsp;Google&nbsp;Maps&nbsp;→
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
