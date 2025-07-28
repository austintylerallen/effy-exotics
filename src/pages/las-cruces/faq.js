// src/pages/las-cruces/faq.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

export default function FAQPage() {
  const faqs = [
    {
      q: "What are your hours?",
      a: "Saturday 7:00 AM – 11:30 PM; Sunday 10:00 AM – 11:30 PM; Monday–Friday 7:00 AM – 11:30 PM."
    },
    {
      q: "Where are you located?",
      a: "2153 W Picacho Ave, Las Cruces, NM 88077."
    },
    {
      q: "Do I need to be 21 to purchase?",
      a: "Yes. A valid government‑issued ID proving you’re 21+ is required for adult‑use purchases."
    },
    {
      q: "What forms of payment do you accept?",
      a: "Cash is always accepted; card options may vary—please call ahead to confirm today’s options."
    },
    {
      q: "Do you offer online ordering?",
      a: "Yes—tap TrapHouse in the menu to browse and place an order for pickup."
    },
    {
      q: "Do you have medical discounts?",
      a: "Ask in store about current medical or veteran discounts and promotions."
    }
  ];

  // Build FAQPage JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a }
      }))
    },
    // Breadcrumbs for the page
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.effyexotics.com/las-cruces" },
        { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.effyexotics.com/las-cruces/faq" }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Answers about Effy Exotics Las Cruces—hours, age requirements, payments, online ordering, and more."
        type="website"
        canonical="https://www.effyexotics.com/las-cruces/faq"
        jsonLd={jsonLd}
      />

      <Header />

      <main className="page" style={{ width: "80%", margin: "0 auto", padding: "40px 0" }}>
        <h1 style={{ fontFamily: "Legend-M54, Oswald, sans-serif", marginBottom: 24, letterSpacing: 2 }}>
          Frequently Asked Questions
        </h1>

        {/* Simple FAQ list; you can style with your SCSS */}
        <dl style={{ margin: 0 }}>
          {faqs.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 24, borderBottom: "1px solid #222", paddingBottom: 16 }}>
              <dt style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: 8 }}>{q}</dt>
              <dd style={{ marginLeft: 0, opacity: 0.9 }}>{a}</dd>
            </div>
          ))}
        </dl>

        <p style={{ marginTop: 32, fontSize: "0.9rem", opacity: 0.75 }}>
          *Information provided is for general guidance. Regulations and store policies may change—call us at{" "}
          <a href="tel:+15756524619" style={{ color: "#C09B31", textDecoration: "none" }}>
            (575) 652‑4619
          </a>{" "}
          with any questions.
        </p>
      </main>

      <Footer />
    </>
  );
}
