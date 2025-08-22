import { useEffect, useMemo, useState } from "react";
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import SubscribeForm from "../../components/SubscribeForm";
import CTAButtons    from "../../components/CTAButtons";
import styles        from "./index.module.css";

/* ── location constants ──────────────────────────────────── */
const LS_CANON   = "https://www.effyexotics.com/las-cruces";
const LS_ADDR    = "2153 W Picacho Ave, Las Cruces, NM 88077";
const LS_TEL     = "+15756524619";
const LS_TEL_FMT = "(575) 652-4619";
const LS_HOURS   = "Mo-Fr 07:00-23:30, Sa 07:00-23:30, Su 10:00-23:30"; // fallback only
const PLACE_ID   = process.env.NEXT_PUBLIC_LC_PLACE_ID || "ChIJb71bdzE93oYR992nSQCWrZA";
/* ─────────────────────────────────────────────────────────── */

export default function Home() {
  // ---- live hours state (from /api/hours)
  const [hours, setHours] = useState([]); // array of strings like "Monday: 7:00 AM – 11:30 PM"
  const [openNow, setOpenNow] = useState(null); // true/false/null
  const [loadingHours, setLoadingHours] = useState(true);
  const [hoursErr, setHoursErr] = useState("");

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const res = await fetch(`/api/hours?placeId=${encodeURIComponent(PLACE_ID)}`, { cache: "no-store" });
        const json = await res.json();
        if (off) return;
        if (!res.ok || json?.error) {
          setHoursErr(json?.message || json?.error || "Unable to load hours");
          setHours([]);
        } else {
          const oh = json?.opening_hours || {};
          setHours(Array.isArray(oh?.weekday_text) ? oh.weekday_text : []);
          setOpenNow(typeof oh?.open_now === "boolean" ? oh.open_now : null);
        }
      } catch (e) {
        if (!off) setHoursErr("Unable to load hours");
      } finally {
        if (!off) setLoadingHours(false);
      }
    })();
    return () => { off = true; };
  }, []);

  // Google returns Monday..Sunday; Date.getDay() is 0=Sun..6=Sat.
  const weekdayIndex = useMemo(() => ( (new Date().getDay() + 6) % 7 ), []);
  const todayLine = useMemo(() => (hours && hours[weekdayIndex]) || "", [hours, weekdayIndex]);

  // A compact "Today: 7:00 AM – 11:30 PM" for the hero chip (fallback if empty)
  const todayCompact = useMemo(() => {
    if (!todayLine) return "";
    const parts = todayLine.split(":");
    return parts.length > 1 ? `Today: ${parts.slice(1).join(":").trim()}` : todayLine;
  }, [todayLine]);

  return (
    <>
      {/* ── SEO / Structured-data tag  ─────────────────────── */}
      <SEO
        title="Effy Exotics | Las Cruces Cannabis Dispensary"
        description="Shop premium flower, edibles, vapes & concentrates at Effy Exotics — Las Cruces’ go-to dispensary."
        canonical={LS_CANON}
        image="/img/social-preview.jpg"
        type="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CannabisDispensary",
            name:       "Effy Exotics — Las Cruces",
            url:        LS_CANON,
            telephone:  LS_TEL,
            openingHours: LS_HOURS, // keep static here; UI below is live
            image:      "https://effyexotics.com/img/effy-dispensary.svg",
            address: {
              "@type": "PostalAddress",
              streetAddress:   "2153 W Picacho Ave",
              addressLocality: "Las Cruces",
              addressRegion:   "NM",
              postalCode:      "88077",
              addressCountry:  "US",
            },
          },
        ]}
      />

      <Header />

      <main className={styles.page}>
        {/* ── HERO  ────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroMedia}>
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics cannabis flower close-up"
              fill
              priority
              sizes="100vw"
            />
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>Las Cruces • Open Daily</div>
            <h1 className={styles.h1}>
              Las Cruces <span className={styles.lastH1}>Cannabis Dispensary</span>
            </h1>
            <p className={styles.heroSub}>
              Boutique flower, chef-crafted edibles, solvent-free vapes & potent concentrates.
            </p>

            <div className={styles.heroChips} role="list">
              <a role="listitem" className={styles.chip} href={`tel:${LS_TEL}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.2 11.2 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.2 11.2 0 00.56 3.5 1 1 0 01-.25 1L6.6 10.8z"/></svg>
                {LS_TEL_FMT}
              </a>
              <a
                role="listitem"
                className={styles.chip}
                href={`https://maps.google.com/?q=${encodeURIComponent(LS_ADDR)}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>
                2153 W Picacho Ave
              </a>
              <span role="listitem" className={`${styles.chip} ${styles.chipHours}`} aria-live="polite">
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 8a1 1 0 011 1v3.2l2.4 1.4a1 1 0 11-1 1.7l-3-1.8A1 1 0 0111 13V9a1 1 0 011-1zm8-3a3 3 0 013 3v10a3 3 0 01-3 3H4a3 3 0 01-3-3V8a3 3 0 013-3h16zm1 3a1 1 0 00-1-1H4a1 1 0 00-1 1v2h18z"/></svg>
                {loadingHours ? "Loading hours…" : (todayCompact || "Hours available on Google")}
                {typeof openNow === "boolean" && (
                  <span className={openNow ? styles.statusOpen : styles.statusClosed}>
                    {openNow ? "Open now" : "Closed now"}
                  </span>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* ── INTRO  ───────────────────────────────────────── */}
        <section className={styles.introCard}>
          <div className={styles.introGrid}>
            <div className={styles.copy}>
              <h2 className={styles.h2}>
                Welcome to <span>Effy Exotics Las Cruces</span>
              </h2>

              <p className={styles.lead}>
                Discover a hand-selected menu of boutique flower, chef-crafted edibles, solvent-free vapes,
                potent concentrates and therapeutic CBD. Whether you’re visiting for medical relief
                or pure recreation, our knowledgeable budtenders curate the perfect experience—every time.
              </p>

              <CTAButtons
                address={LS_ADDR}
                phone={LS_TEL_FMT}
                shopUrl={process.env.NEXT_PUBLIC_LC_SHOP_URL || "/las-cruces/shop"}
                location="las-cruces"
                className={`${styles.introCtas} intro-ctas`}
              />
            </div>

            <aside className={styles.info}>
              <div className={styles.infoCard}>
                <h3>Visit Us</h3>
                <ul className={styles.hoursList} aria-live="polite">
                  <li className={styles.hoursItem}>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>
                    {LS_ADDR}
                  </li>
                  <li className={styles.hoursItem}>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.2 11.2 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.2 11.2 0 00.56 3.5 1 1 0 01-.25 1L6.6 10.8z"/></svg>
                    {LS_TEL_FMT}
                  </li>

                  {/* Dynamic hours block */}
                  <li className={styles.hoursItem}>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 8a1 1 0 011 1v3.2l2.4 1.4a1 1 0 11-1 1.7l-3-1.8A1 1 0 0111 13V9a1 1 0 011-1zm8-3a3 3 0 013 3v10a3 3 0 01-3 3H4a3 3 0 01-3-3V8a3 3 0 013-3h16zm1 3a1 1 0 00-1-1H4a1 1 0 00-1 1v2h18z"/></svg>

                    <div className={styles.hoursWrap}>
                      <div className={styles.hoursHeader}>
                        <span>Hours</span>
                        {typeof openNow === "boolean" && (
                          <em className={openNow ? styles.statusOpen : styles.statusClosed}>
                            {openNow ? "Open now" : "Closed now"}
                          </em>
                        )}
                      </div>

                      {loadingHours && (
                        <ul className={styles.skeletonList}>
                          {Array.from({ length: 7 }).map((_, i) => (
                            <li key={i} className={styles.skeletonLine} />
                          ))}
                        </ul>
                      )}

                      {!loadingHours && hoursErr && (
                        <p className={styles.hoursError}>
                          {hoursErr}. Fallback: <strong>{LS_HOURS}</strong>
                        </p>
                      )}

                      {!loadingHours && !hoursErr && hours?.length > 0 && (
                        <ul className={styles.weekList}>
                          {hours.map((line, idx) => (
                            <li key={idx} className={styles.weekRow}>
                              <span className={styles.bullet} aria-hidden="true">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {!loadingHours && !hoursErr && (!hours || hours.length === 0) && (
                        <p className={styles.hoursFallback}>Hours: {LS_HOURS}</p>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* ── EMAIL / SMS CAPTURE  ────────────────────────── */}
        <section className={styles.subscribeWrap}>
          <SubscribeForm city="las-cruces" />
        </section>
      </main>

      <Footer />
    </>
  );
}
