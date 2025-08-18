// src/pages/alamogordo/index.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import Link          from "next/link";
import SubscribeForm from "../../components/SubscribeForm";
import CTAButtons    from "../../components/CTAButtons";

import {
  ALAMO_ADDR,
  ALAMO_TEL,      // currently "TBD" — we’ll omit the Call button until set
  ALAMO_HOURS,
  ALAMO_CANON,
  ALAMO_IMG
} from "../../config/alamogordo.constants";

const SITE_URL = "https://www.effyexotics.com"; // keep in sync with lib/seo

function parseAddress(addr) {
  const [street, cityStateZip = ""] = String(addr).split(",").map(s => s.trim());
  const [city, rest = ""] = cityStateZip.split(",").map(s => s.trim());
  const [region, postalCode] = (rest || "").split(/\s+/);
  return { streetAddress: street, addressLocality: city, addressRegion: region, postalCode };
}

function openingHoursSpec(hours) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  if (Array.isArray(hours) && hours.length) {
    const time = hours[0].split(" ")[1] || "09:00-21:00";
    const [opens, closes] = time.split("-");
    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days, opens, closes
    }];
  }
  if (hours && typeof hours === "object") {
    const map = { Mo:"Monday", Tu:"Tuesday", We:"Wednesday", Th:"Thursday", Fr:"Friday", Sa:"Saturday", Su:"Sunday" };
    return Object.entries(hours).map(([abbr, time]) => {
      const [opens, closes] = String(time).split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: map[abbr] || abbr, opens, closes };
    });
  }
  return undefined;
}

export default function Home() {
  const addr = parseAddress(ALAMO_ADDR);
  const telDigits = String(ALAMO_TEL || "").replace(/\D/g, "");
  const telE164 = telDigits ? `+1${telDigits}` : undefined;

  const jsonLocalBusiness = {
    "@context": "https://schema.org",
    "@type": ["Store","LocalBusiness"],
    name: "Effy Exotics — Alamogordo",
    url: ALAMO_CANON,
    image: [new URL(ALAMO_IMG, SITE_URL).href],
    logo: `${SITE_URL}/img/effy-dispensary.svg`,
    telephone: telE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: addr.streetAddress,
      addressLocality: addr.addressLocality || "Alamogordo",
      addressRegion: addr.addressRegion || "NM",
      postalCode: addr.postalCode,
      addressCountry: "US"
    },
    openingHoursSpecification: openingHoursSpec(ALAMO_HOURS),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ALAMO_ADDR)}`,
    sameAs: [
      "https://www.instagram.com/effyexotics",
      "https://www.facebook.com/effyexotics"
    ],
    priceRange: "$$"
  };

  const jsonBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Alamogordo", item: ALAMO_CANON }
    ]
  };

  return (
    <>
      <SEO
        title="Alamogordo Cannabis Dispensary"
        description="Shop premium flower, edibles, vapes & concentrates at Effy Exotics — Alamogordo’s go-to dispensary."
        canonical={ALAMO_CANON}
        image={ALAMO_IMG}
        jsonLd={[jsonLocalBusiness, jsonBreadcrumbs]}
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
            Alamogordo&nbsp;<span className="last-h1">Cannabis Dispensary</span>
          </h1>
        </section>

        {/* ── INTRO CARD ─────────────────────────────────────── */}
        <section className="intro-card">
          <h2>
            Welcome&nbsp;to&nbsp;<span>Effy Exotics Alamogordo</span>
          </h2>
          <p>
            Effy Exotics proudly serves Alamogordo with top-tier cannabis — craft flower,
            potent concentrates, delicious edibles, terp-rich vapes and thoughtfully-curated CBD.
            Whether you shop medical or recreational, our bud-team will guide you to a premium experience
            every visit.
          </p>
          <p style={{marginTop: "0.75rem"}}>
            Looking for our Las Cruces location?{" "}
            <Link href="/las-cruces">Go here.</Link>
          </p>

          {/* Tracked CTAs — phone omitted (TBD). Add shopUrl when live. */}
          <CTAButtons
            address={ALAMO_ADDR}
            // phone not passed until you have it
            shopUrl={process.env.NEXT_PUBLIC_ALAMO_SHOP_URL /* or omit to hide */}
            location="alamogordo"
            className="intro-ctas"
          />
        </section>

        {/* ── EMAIL / SMS CAPTURE ───────────────────────────── */}
        <SubscribeForm city="alamogordo" />
      </main>

      <Footer />
    </>
  );
}
