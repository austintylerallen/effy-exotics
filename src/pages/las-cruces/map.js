// File: src/pages/las-cruces/map.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import OpeningHours  from "../../components/OpeningHours";
import { track }     from "../../lib/track";
import styles        from "./map.module.css";

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

      <main className={styles.page}>
        {/* ─── Hero banner ─────────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Location banner">
          <Image
            src="/img/directions1200.jpeg"
            alt="Effy Exotics – find us in Las Cruces"
            fill
            priority
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Visit Effy Exotics — Las Cruces</h1>
            <p className={styles.heroSubtitle}>Directions, hours & contact info</p>
          </div>
        </section>

        {/* ─── Content grid: Map + Card ───────────────────────────── */}
        <section className={styles.grid}>
          <div className={styles.mapCard}>
            <div className={styles.ratio}>
              <iframe
                title="Effy Exotics Location"
                src={embedSrc}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <Image
                className={styles.logo}
                src="/img/effy-dispensary.svg"
                alt="Effy Exotics icon"
                width={48}
                height={48}
              />
              <h2 className={styles.cardTitle}>New Mexico’s Hottest Dispensary</h2>
            </div>

            <address className={styles.address}>
              {addressLine}
            </address>

            <div className={styles.actions}>
              <a
                className={`${styles.btn} ${styles.btnGold}`}
                href={`tel:${telHref}`}
                onClick={onCall}
              >
                Call {telPretty}
              </a>

              <a
                className={`${styles.btn} ${styles.btnGhost}`}
                href={gmapsDest}
                onClick={onDirections}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps →
              </a>
            </div>

            <div className={styles.hoursBlock}>
              <h3 className={styles.subhead}>Dispensary Hours</h3>
              <OpeningHours placeId="ChIJb71bdzE93oYR992nSQCWrZA" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
