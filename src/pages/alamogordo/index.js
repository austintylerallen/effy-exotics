import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import SubscribeForm from "../../components/SubscribeForm";

import {
  ALAMO_ADDR,
  ALAMO_TEL,
  ALAMO_HOURS,
  ALAMO_CANON,
  ALAMO_IMG
} from "../../config/alamogordo.constants";

export default function Home() {
  return (
    <>
      <SEO
        title="Effy Exotics | Alamogordo Cannabis Dispensary"
        description="Shop premium flower, edibles, vapes & concentrates at Effy Exotics — Alamogordo’s go-to dispensary."
        canonical={ALAMO_CANON}
        image={ALAMO_IMG}
        jsonLd={[
          {
            "@context"   : "https://schema.org",
            "@type"      : "CannabisDispensary",
            name         : "Effy Exotics — Alamogordo",
            url          : ALAMO_CANON,
            telephone    : ALAMO_TEL,
            openingHours : ALAMO_HOURS,
            image        : "https://effyexotics.com/img/effy-dispensary.svg",
            address      : {
              "@type"          : "PostalAddress",
              streetAddress    : "1408 Black St",
              addressLocality  : "Alamogordo",
              addressRegion    : "NM",
              postalCode       : "88310",
              addressCountry   : "US"
            }
          }
        ]}
      />

      <Header />

      <main>
        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics Alamogordo Dispensary"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <h1>
            Alamogordo&nbsp;
            <span className="last-h1">Cannabis Dispensary</span>
          </h1>
        </section>

        {/* ── INTRO CARD  (black ➝ gold gradient) ───────────── */}
        <section className="intro-card">
          <h2>
            Welcome&nbsp;to&nbsp;
            <span>Effy Exotics Alamogordo</span>
          </h2>

          <p>
            Effy Exotics proudly serves Alamogordo with top-tier cannabis&nbsp;—
            craft flower, potent concentrates, delicious edibles, terp-rich
            vapes and thoughtfully-curated CBD. Whether you shop medical or
            recreational, our bud-team will guide you to a premium experience
            every visit.
          </p>
        </section>

        {/* ── STAY-IN-THE-LOOP  ─────────────────────────────── */}
        <SubscribeForm />
      </main>

      <Footer />
    </>
  );
}
