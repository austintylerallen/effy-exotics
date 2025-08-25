// File: src/pages/las-cruces/faq.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import SubscribeForm from "../../components/SubscribeForm";
import Link          from "next/link";

export default function FAQPage() {
  /* ─── data ─────────────────────────────────────────────────── */
  // UI answers can contain JSX (links). For JSON-LD we also provide plain text.
  const items = [
    {
      q: "Who can shop at Effy Exotics?",
      a: (
        <>Adults 21+ with a valid, government-issued photo ID. Out-of-state IDs are accepted.</>
      ),
      aText:
        "Adults 21+ with a valid, government-issued photo ID. Out-of-state IDs are accepted.",
    },
    {
      q: "How do I place an online order for pickup?",
      a: (
        <>
          Online ordering is available where listed on each location page. Visit{" "}
          <Link href="/las-cruces/map">Las Cruces</Link> or{" "}
          <Link href="/alamogordo/map">Alamogordo</Link> and use the menu link if shown.
          If a location’s online menu isn’t live yet, you can shop in-store.
        </>
      ),
      aText:
        "Online ordering is available where listed on each location page. Visit Las Cruces (https://www.effyexotics.com/las-cruces/map) or Alamogordo (https://www.effyexotics.com/alamogordo/map). If a location’s online menu isn’t live yet, you can shop in-store.",
    },
    {
      q: "What forms of payment do you accept?",
      a: (
        <>
          Cash is always accepted. Card options may vary by day and provider—please call
          the location to confirm today’s options.
        </>
      ),
      aText:
        "Cash is always accepted. Card options may vary by day and provider—please call the location to confirm today’s options.",
    },
    {
      q: "Do you offer medical or veteran discounts?",
      a: (
        <>
          Ask in-store about current promotions. Offers can change and exclusions may apply.
        </>
      ),
      aText:
        "Ask in-store about current promotions. Offers can change and exclusions may apply.",
    },
    {
      q: "Can I return or exchange products?",
      a: (
        <>
          Due to state regulations, cannabis sales are typically final. For defective
          items, bring the product and receipt to the store; our team will review per policy.
        </>
      ),
      aText:
        "Due to state regulations, cannabis sales are typically final. For defective items, bring the product and receipt to the store for review per policy.",
    },
    {
      q: "Where can I find directions and hours?",
      a: (
        <>
          Please see your location page:{" "}
          <Link href="/las-cruces/map">Las Cruces</Link> or{" "}
          <Link href="/alamogordo/map">Alamogordo</Link>. Hours are published on those pages.
        </>
      ),
      aText:
        "See your location page for directions and hours: Las Cruces (https://www.effyexotics.com/las-cruces/map) or Alamogordo (https://www.effyexotics.com/alamogordo/map).",
    },
    {
      q: "How do I contact a specific store?",
      a: (
        <>
          Call the store listed on its location page:{" "}
          <Link href="/las-cruces/map">Las Cruces</Link> or{" "}
          <Link href="/alamogordo/map">Alamogordo</Link>.
        </>
      ),
      aText:
        "Call the store listed on its location page: Las Cruces (https://www.effyexotics.com/las-cruces/map) or Alamogordo (https://www.effyexotics.com/alamogordo/map).",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(({ q, aText }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": aText }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.effyexotics.com/" },
        { "@type": "ListItem", "position": 2, "name": "FAQ",  "item": "https://www.effyexotics.com/las-cruces/faq" }
      ]
    }
  ];

  /* ─── markup ───────────────────────────────────────────────── */
  return (
    <>
      <SEO
        title="Help & Policies — Effy Exotics"
        description="General guidance for shopping at Effy Exotics: eligibility, ordering, payments, discounts, returns, and how to reach each location."
        type="website"
        canonical="https://www.effyexotics.com/las-cruces/faq"
        jsonLd={jsonLd}
      />

      <Header />

      <main>
        <div
          style={{
            width: "min(960px, 92%)",
            margin: "0 auto",
            padding: "48px 0 40px",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "2rem",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Help & Policies
          </h1>

          <dl style={{ margin: 0 }}>
            {items.map(({ q, a }, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <dt style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>
                  {q}
                </dt>
                <dd style={{ marginLeft: 0, opacity: 0.9, lineHeight: 1.6 }}>
                  {a}
                </dd>
              </div>
            ))}
          </dl>

          

          <p
            style={{
              marginTop: 36,
              fontSize: "0.9rem",
              opacity: 0.78,
              textAlign: "center",
            }}
          >
            *Information is for general guidance and may change. For location-specific
            details, please see the{" "}
            <Link href="/las-cruces/map">Las Cruces</Link> or{" "}
            <Link href="/alamogordo/map">Alamogordo</Link> pages.
          </p>
        </div>

        {/* ── Opt-in bar ─────────────────────────────────────── */}
        <div style={{ marginTop: 28, marginBottom: 8 }}>
            <SubscribeForm />
          </div>
      </main>

      <Footer />
    </>
  );
}
