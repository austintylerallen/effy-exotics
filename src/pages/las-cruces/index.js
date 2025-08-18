import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import SubscribeForm from "../../components/SubscribeForm";
import CTAButtons    from "../../components/CTAButtons";

/* ── location constants ──────────────────────────────────── */
const LS_CANON   = "https://www.effyexotics.com/las-cruces";
const LS_ADDR    = "2153 W Picacho Ave, Las Cruces, NM 88077";
const LS_TEL     = "+15756524619";
const LS_TEL_FMT = "(575) 652-4619";
const LS_HOURS   = "Mo-Fr 07:00-23:30, Sa 07:00-23:30, Su 10:00-23:30";
/* ─────────────────────────────────────────────────────────── */

export default function Home() {
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
            openingHours: LS_HOURS,
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

      <main>
        {/* ── HERO  ────────────────────────────────────────── */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics cannabis flower close-up"
              fill
              priority
              sizes="100vw"
            />
            <div className="hero-overlay" />
          </div>

          {/* full-width banner */}
          <h1>
            Las Cruces&nbsp;
            <span className="last-h1">Cannabis Dispensary</span>
          </h1>
        </section>

        {/* ── INTRO  ───────────────────────────────────────── */}
        <section className="intro-card">
          <h2>
            Welcome to&nbsp;<span>Effy Exotics Las Cruces</span>
          </h2>

          <p>
            Discover a hand-selected menu of boutique flower, chef-crafted
            edibles, solvent-free vapes, potent concentrates and therapeutic
            CBD. Whether you’re visiting for medical relief or pure recreation,
            our knowledgeable budtenders are here to curate the perfect
            experience—every time.
          </p>

          {/* Tracked CTAs */}
          <CTAButtons
            address={LS_ADDR}
            phone={LS_TEL_FMT}
            shopUrl={process.env.NEXT_PUBLIC_LC_SHOP_URL || "/las-cruces/shop"}
            location="las-cruces"
            className="intro-ctas"
          />
        </section>

        {/* ── EMAIL / SMS CAPTURE  ────────────────────────── */}
        <SubscribeForm city="las-cruces" />
      </main>

      <Footer />
    </>
  );
}
