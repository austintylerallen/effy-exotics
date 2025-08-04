// src/pages/about.js
import Header        from "../../components/Header";
import Footer        from "../../components/Footer";
import SEO           from "../../components/SEO";
import Image         from "next/image";
import SubscribeForm from "../../components/SubscribeForm";

export default function About() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name:        "About Effy Exotics",
      description: "Learn about Effy Exotics in Las Cruces, NM—our mission, quality standards, and the team behind our premium cannabis."
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://www.effyexotics.com/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.effyexotics.com/about" }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="About Effy Exotics"
        description="Welcome to Effy Exotics—Las Cruces’ destination for premium cannabis. Learn about our story, standards, and what sets us apart."
        image="/img/about1200.jpeg"
        type="website"
        jsonLd={jsonLd}
      />

      <Header />

      <main className="about page">
        {/* ─── Hero ───────────────────────────────────────────── */}
        <section className="top-image" aria-label="About Effy Exotics">
          <picture>
            <source media="(min-width:1200px)" srcSet="/img/about.jpeg" />
            <source media="(min-width:768px)"  srcSet="/img/about1200.jpeg" />
            <Image
              src="/img/about767.jpeg"
              alt="About Effy Exotics"
              className="banner-img"
              fill
              priority
              sizes="100vw"
            />
          </picture>
        </section>

        {/* ─── Core copy ──────────────────────────────────────── */}
        <section className="int-main-section">
          <h1>About&nbsp;Us</h1>

          <div>
            <Image
              src="/img/effy-dispensary.svg"
              alt="Effy Exotics icon"
              width={48}
              height={48}
              className="icon"
            />

            <div>
              <h2>New&nbsp;Mexico&rsquo;s&nbsp;Hottest&nbsp;Dispensary</h2>

              <p>
                Welcome to Effy Exotics, your premier destination for
                top-quality cannabis products in Las Cruces, New&nbsp;Mexico.
                Whether you&rsquo;re a seasoned connoisseur or exploring for the
                first time, we&rsquo;re here to guide your journey.
              </p>

              <p>
                We curate an extensive selection of exotic strains, artisanal
                edibles, and clean concentrates. Every product on our shelves
                is vetted for purity, potency, and consistency—so you can shop
                with confidence.
              </p>

              <p>
                Our friendly, knowledgeable team focuses on education and
                personalised recommendations. We believe in responsible use and
                a welcoming, inclusive community for everyone who loves the
                plant.
              </p>

              <p>
                Stop by our modern storefront in the heart of Las&nbsp;Cruces
                and discover why Effy Exotics sets the standard for quality and
                service.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Opt-in bar ─────────────────────────────────────── */}
        <SubscribeForm city="las-cruces" />
      </main>

      <Footer />
    </>
  );
}
