// src/pages/the-lab.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

export default function TheLab() {
  const jsonLd = [
    // The page itself
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Lab – Effy Exotics Grow House",
      "description": "Inside Effy Exotics’ grow house in Las Cruces, NM—our cultivation methods, sustainability, genetics, and quality assurance.",
    },
    // Org info (kept simple since this is a subpage)
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Effy Exotics",
      "url": "https://www.effyexotics.com",
      "logo": "https://www.effyexotics.com/img/effy-dispensary.svg",
      "sameAs": [
        "https://www.facebook.com/effyexotics",
        "https://www.instagram.com/effyexotics"
      ]
    },
    // Breadcrumbs
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.effyexotics.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "The Lab",
          "item": "https://www.effyexotics.com/the-lab"
        }
      ]
    },
    // FAQ
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes Effy Exotics’ cultivation unique?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We combine climate‑controlled rooms, small‑batch phenohunting, and strict testing for potency and purity to deliver consistent, top‑shelf flower."
          }
        },
        {
          "@type": "Question",
          "name": "Do you grow exclusive genetics?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We continuously hunt, refine, and stabilize new crosses to release exclusive Effy Exotics strains you won’t find elsewhere."
          }
        },
        {
          "@type": "Question",
          "name": "Are your practices sustainable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use high‑efficiency lighting, closed‑loop environmental controls, targeted irrigation, and waste‑reduction SOPs to lower our footprint."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="The Lab – Grow House & Cultivation"
        description="Step inside Effy Exotics’ grow house in Las Cruces, NM. Learn about our cultivation rooms, genetics program, sustainability practices, and quality testing."
        image="/img/thelab1200.jpeg"
        type="website"
        jsonLd={jsonLd}
      />

      <Header />

      <main className="the_lab page">
        {/* Top Image / Hero */}
        <section className="top-image" aria-label="The Lab hero image">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/thelab.jpeg" />
            <source media="(min-width: 768px)" srcSet="/img/thelab1200.jpeg" />
            <img src="/img/thelab767.jpeg" alt="Effy Exotics grow house" />
          </picture>
        </section>

        {/* Content */}
        <section className="int-main-section">
          <h1>The Lab</h1>
          <div>
            <img className="icon" src="/img/effy-dispensary.svg" alt="Effy Exotics icon" />
            <div>
              <h2>New Mexico&apos;s Hottest Dispensary</h2>
              <p>
                Welcome to the Effy Exotics Grow House—where cultivation meets excellence in
                Las Cruces, New Mexico. Our small‑batch approach and dialed‑in environments
                bring out rich terpene profiles, clean burns, and consistent potency.
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
                <li><strong>Sustainability:</strong> High‑efficiency lighting and water stewardship.</li>
              </ul>

              <p style={{ marginTop: 24 }}>
                Ready to experience the results? <a href="/shop">Shop the TrapHouse</a> to find
                current drops and exclusives.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
