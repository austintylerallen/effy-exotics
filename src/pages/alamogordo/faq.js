import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { ALAMO_CANON, ALAMO_TEL, ALAMO_TEL_PRETTY, ALAMO_HOURS, ALAMO_IMG } from "./_constants";

export default function FAQ() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CannabisDispensary",
      name: "Effy Exotics — Alamogordo",
      url: `${ALAMO_CANON}/faq`,
      telephone: ALAMO_TEL,
      openingHours: ALAMO_HOURS,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1408 Black St",
        addressLocality: "Alamogordo",
        addressRegion: "NM",
        postalCode: "88310",
        addressCountry: "US"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.effyexotics.com/" },
        { "@type": "ListItem", position: 2, name: "FAQ", item: `${ALAMO_CANON}/faq` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are Effy Exotics’ hours in Alamogordo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We’re open Monday–Friday 7:00 AM – 11:30 PM, Saturday 7:00 AM – 11:30 PM, and Sunday 10:00 AM – 11:30 PM."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Effy Exotics located in Alamogordo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our dispensary is located at 1408 Black St, Alamogordo, NM 88310."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer medical and recreational cannabis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we serve both medical patients and adult-use recreational customers with a wide range of premium products."
          }
        },
        {
          "@type": "Question",
          "name": "What products are available at Effy Exotics Alamogordo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer exotic flower, edibles, pre-rolls, vapes, concentrates, topicals, and CBD products."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer online ordering?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can browse and order through our online TrapHouse menu for in-store pickup."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="FAQ – Effy Exotics Alamogordo"
        description="Answers to frequently asked questions about Effy Exotics Alamogordo—location, hours, products, and more."
        image={ALAMO_IMG}
        canonical={`${ALAMO_CANON}/faq`}
        jsonLd={jsonLd}
      />

      <Header />

      <main className="faq page">
        <section className="int-main-section">
          <h1>FAQ</h1>
          <div>
            <div className="faq-item">
              <h2>What are Effy Exotics’ hours in Alamogordo?</h2>
              <p>Monday–Friday 7:00 AM – 11:30 PM, Saturday 7:00 AM – 11:30 PM, Sunday 10:00 AM – 11:30 PM.</p>
            </div>
            <div className="faq-item">
              <h2>Where is Effy Exotics located?</h2>
              <p>We’re located at 1408 Black St, Alamogordo, NM 88310.</p>
            </div>
            <div className="faq-item">
              <h2>Do you serve both medical and recreational customers?</h2>
              <p>Yes. We proudly serve medical patients and recreational users alike with a premium selection of cannabis products.</p>
            </div>
            <div className="faq-item">
              <h2>What products do you carry?</h2>
              <p>We carry flower, edibles, pre-rolls, vapes, concentrates, topicals, and CBD items.</p>
            </div>
            <div className="faq-item">
              <h2>Do you offer online ordering?</h2>
              <p>Yes. You can order via our <a href="/alamogordo/shop" style={{ color: "#C09B31", textDecoration: "none" }}>TrapHouse menu</a> for in-store pickup.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
