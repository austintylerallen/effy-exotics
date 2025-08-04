import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import Link          from "next/link";
import SubscribeForm from "../../components/SubscribeForm";

import {
  ALAMO_CANON,
  ALAMO_TEL,
  ALAMO_HOURS,
  ALAMO_IMG
} from "../../config/alamogordo.constants";

export default function TheLab() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CannabisDispensary",
      name         : "Effy Exotics — Alamogordo",
      url          : ALAMO_CANON,
      telephone    : ALAMO_TEL,
      openingHours : ALAMO_HOURS,
      address      : {
        "@type"         : "PostalAddress",
        streetAddress   : "1408 Black St",
        addressLocality : "Alamogordo",
        addressRegion   : "NM",
        postalCode      : "88310",
        addressCountry  : "US"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",    item: "https://www.effyexotics.com/" },
        { "@type": "ListItem", position: 2, name: "The Lab", item: `${ALAMO_CANON}/the-lab` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What makes Effy Exotics’ cultivation unique?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We combine climate-controlled rooms, small-batch phenohunting, and strict testing for potency and purity to deliver consistent, top-shelf flower."
          }
        },
        {
          "@type": "Question",
          name: "Do you grow exclusive genetics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We continuously hunt, refine, and stabilize new crosses to release exclusive Effy Exotics strains you won’t find elsewhere."
          }
        },
        {
          "@type": "Question",
          name: "Are your practices sustainable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use high-efficiency lighting, closed-loop environmental controls, targeted irrigation, and waste-reduction SOPs to lower our footprint."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="The Lab – Grow House & Cultivation"
        description="Step inside Effy Exotics’ grow house. Learn about cultivation rooms, genetics program, sustainability practices, and quality testing."
        image={ALAMO_IMG}
        canonical={`${ALAMO_CANON}/the-lab`}
        jsonLd={jsonLd}
        type="website"
      />

      <Header />

      <main className="the_lab page">
        {/* Hero */}
        <section className="top-image" aria-label="The Lab hero image">
          <picture>
            <source media="(min-width:1200px)" srcSet="/img/thelab.jpeg" />
            <source media="(min-width:768px)"  srcSet="/img/thelab1200.jpeg" />
            <Image
              src="/img/thelab767.jpeg"
              alt="Effy Exotics grow house"
              fill
              priority
              className="banner-img"
              sizes="100vw"
            />
          </picture>
        </section>

        {/* Content */}
        <section className="int-main-section">
          <h1>The Lab</h1>
          <div>
            <Image
              className="icon"
              src="/img/effy-dispensary.svg"
              alt="Effy Exotics icon"
              width={48}
              height={48}
            />
            <div>
              <h2>New Mexico's Hottest Dispensary</h2>
              <p>
                Welcome to the Effy Exotics Grow House—where cultivation meets excellence.
                Our small-batch approach and dialed-in environments bring out rich terpene
                profiles, clean burns, and consistent potency.
              </p>
              <p>
                From mother room to cure, every step is guided by SOPs and analytics. We
                phenohunt for standout expressions, refine feeding strategies, and test
                rigorously for purity and consistency.
              </p>

              <h3>What We Focus On</h3>
              <ul>
                <li><strong>Genetics:</strong> Exclusive cultivars and ongoing phenohunts.</li>
                <li><strong>Quality:</strong> Tight environmental control and meticulous curing.</li>
                <li><strong>Sustainability:</strong> High-efficiency lighting and water stewardship.</li>
              </ul>

              <p style={{ marginTop: 24 }}>
                Ready to experience the results?{' '}
                <Link href="/alamogordo/shop" className="text-gold no-underline">
                  Shop the TrapHouse
                </Link>{' '}
                to find current drops and exclusives available in Alamogordo.
              </p>
            </div>
          </div>
        </section>

        {/* Opt-in */}
        <SubscribeForm city="alamogordo" />
      </main>

      <Footer />
    </>
  );
}
