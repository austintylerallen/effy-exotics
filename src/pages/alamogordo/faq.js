import Header       from "../../components/Header";
import Footer       from "../../components/Footer";
import SEO          from "../../components/SEO";
import SubscribeForm from "../../components/SubscribeForm";

import {
  ALAMO_CANON,
  ALAMO_TEL,
  ALAMO_TEL_PRETTY,
  ALAMO_HOURS,
  ALAMO_IMG,
} from "../../config/alamogordo.constants";

export default function FAQPage() {
  /* —— Q&A copy ————————————————————————— */
  const faqs = [
    { q: "What are your hours?",
      a: "Monday–Friday 7:00 AM – 11:30 PM; Saturday 7:00 AM – 11:30 PM; Sunday 10:00 AM – 11:30 PM." },
    { q: "Where are you located?",
      a: "1408 Black St, Alamogordo, NM 88310." },
    { q: "Do I need to be 21 to purchase?",
      a: "Yes. A valid government-issued ID proving you’re 21+ is required for adult-use purchases." },
    { q: "What forms of payment do you accept?",
      a: "Cash is always accepted; card options may vary—please call ahead to confirm today’s options." },
    { q: "Do you offer online ordering?",
      a: "Yes—tap TrapHouse in the menu to browse and place an order for pickup." },
    { q: "Do you have medical discounts?",
      a: "Ask in store about current medical or veteran discounts and promotions." },
  ];

  /* —— JSON-LD ————————————————————————— */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.effyexotics.com/" },
        { "@type": "ListItem", position: 2, name: "FAQ",  item: `${ALAMO_CANON}/faq` },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Answers about Effy Exotics Alamogordo—hours, age requirements, payments, online ordering, and more."
        image={ALAMO_IMG}
        canonical={`${ALAMO_CANON}/faq`}
        jsonLd={jsonLd}
      />

      <Header />

      <main className="page" style={{ width: "80%", margin: "0 auto", padding: "40px 0" }}>
        <h1
          style={{
            fontFamily: "Legend-M54, Oswald, sans-serif",
            marginBottom: 24,
            letterSpacing: 2,
          }}
        >
          Frequently Asked Questions
        </h1>

        {/* FAQ List */}
        <dl style={{ margin: 0 }}>
          {faqs.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 24, borderBottom: "1px solid #222", paddingBottom: 16 }}>
              <dt style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: 8 }}>{q}</dt>
              <dd style={{ marginLeft: 0, opacity: 0.9 }}>{a}</dd>
            </div>
          ))}
        </dl>

        {/* Opt-in widget */}
        <SubscribeForm style={{ marginTop: 56 }} />

        {/* Disclaimer */}
        <p style={{ marginTop: 48, fontSize: "0.9rem", opacity: 0.75, textAlign: "center" }}>
          *Information provided is for general guidance. Regulations and store policies may change—
          call us at{" "}
          <a
            href={ALAMO_TEL === "TBD" ? "#" : `tel:${ALAMO_TEL}`}
            style={{ color: "#C09B31", textDecoration: "none" }}
          >
            {ALAMO_TEL_PRETTY}
          </a>{" "}
          with any questions.
        </p>
      </main>

      <Footer />
    </>
  );
}
