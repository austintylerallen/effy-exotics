// File: src/pages/alamogordo/map.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import OpeningHours  from "../../components/OpeningHours";
import { track }     from "../../lib/track";
import styles        from "./map.module.css";

export default function MapPage() {
  /* ── Alamogordo details ───────────────────────────────────────── */
  const addressLine = "1408 Black St, Alamogordo, NM 88310";

  // phone (pretty + digits/E.164 for tracking + tel:)
  const telPretty   = "575-286-4282";
  const phoneDigits = "5752864282";
  const telHref     = `+1${phoneDigits}`;

  // Set this once Google Business is live:
  const placeId = null; // e.g., "ChIJA..." when available

  // Fallback schedule: 7:00 AM → 1:00 AM daily (next-day close)
  const fallbackHours = {
    weekday_text: [
      "Monday: 7:00 AM – 1:00 AM",
      "Tuesday: 7:00 AM – 1:00 AM",
      "Wednesday: 7:00 AM – 1:00 AM",
      "Thursday: 7:00 AM – 1:00 AM",
      "Friday: 7:00 AM – 1:00 AM",
      "Saturday: 7:00 AM – 1:00 AM",
      "Sunday: 7:00 AM – 1:00 AM",
    ],
    // Google-style periods (0=Sun..6=Sat); close at 01:00 next day
    periods: [
      { open: { day: 1, time: "0700" }, close: { day: 2, time: "0100" } }, // Mon→Tue
      { open: { day: 2, time: "0700" }, close: { day: 3, time: "0100" } }, // Tue→Wed
      { open: { day: 3, time: "0700" }, close: { day: 4, time: "0100" } }, // Wed→Thu
      { open: { day: 4, time: "0700" }, close: { day: 5, time: "0100" } }, // Thu→Fri
      { open: { day: 5, time: "0700" }, close: { day: 6, time: "0100" } }, // Fri→Sat
      { open: { day: 6, time: "0700" }, close: { day: 0, time: "0100" } }, // Sat→Sun
      { open: { day: 0, time: "0700" }, close: { day: 1, time: "0100" } }, // Sun→Mon
    ],
  };

  /* ── derived constants ─────────────────────────────────────────── */
  const canonical = "https://www.effyexotics.com/alamogordo/map";
  const embedSrc  = `https://www.google.com/maps?q=${encodeURIComponent(addressLine)}&output=embed`;
  const gmapsDest = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine)}`;

  /* ── tracking handlers ────────────────────────────────────────── */
  const onCall = () => {
    track("call_click", {
      location: "alamogordo",
      phone: phoneDigits,
      dest: `tel:${telHref}`,
    });
  };
  const onDirections = () => {
    track("directions_click", {
      location: "alamogordo",
      address: addressLine,
      dest: gmapsDest,
    });
  };

  /* ── structured-data / breadcrumbs ────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CannabisDispensary",
      "@id": "https://www.effyexotics.com/alamogordo/#store-alamogordo",
      name: "Effy Exotics — Alamogordo",
      url: "https://www.effyexotics.com/alamogordo",
      image: "https://www.effyexotics.com/img/effy-dispensary.svg",
      telephone: "+1-575-286-4282",
      priceRange: "$$",
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.effyexotics.com/" },
        { "@type": "ListItem", position: 2, name: "Alamogordo", item: "https://www.effyexotics.com/alamogordo" },
        { "@type": "ListItem", position: 3, name: "Directions", item: canonical }
      ],
    },
  ];

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <>
      <SEO
        title="Directions & Map — Alamogordo"
        description="Find Effy Exotics in Alamogordo, NM. Get directions, view our location on Google Maps, and see store hours."
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
            alt="Effy Exotics – find us in Alamogordo"
            fill
            priority
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Visit Effy Exotics — Alamogordo</h1>
            <p className={styles.heroSubtitle}>Directions, hours & contact info</p>
          </div>
        </section>

        {/* ─── Content grid: Map + Card ───────────────────────────── */}
        <section className={styles.grid}>
          <div className={styles.mapCard}>
            <div className={styles.ratio}>
              <iframe
                title="Effy Exotics Alamogordo Location"
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

            <address className={styles.address}>{addressLine}</address>

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
              {placeId
                ? <OpeningHours placeId={placeId} />
                : <OpeningHours fallback={fallbackHours} />
              }
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
