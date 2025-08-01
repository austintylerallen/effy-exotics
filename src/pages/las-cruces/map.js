// src/pages/las-cruces/map.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

export default function MapPage() {
  const addressLine = "2153 W Picacho Ave, Las Cruces, NM 88077";
  const telPretty = "575-652-4619";
  const telHref = "+15756524619";

  const canonical = "https://www.effyexotics.com/las-cruces/map";

  const embedSrc =
    "https://www.google.com/maps?q=2153+W+Picacho+Ave,+Las+Cruces,+NM+88077&output=embed";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CannabisDispensary",
      "@id": "https://www.effyexotics.com/las-cruces/#store-las-cruces",
      "name": "Effy Exotics — Las Cruces",
      "url": "https://www.effyexotics.com/las-cruces",
      "image": "https://www.effyexotics.com/img/effy-dispensary.svg",
      "telephone": "+1-575-652-4619",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2153 W Picacho Ave",
        "addressLocality": "Las Cruces",
        "addressRegion": "NM",
        "postalCode": "88077",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 32.311383948399154,
        "longitude": -106.80641921326792
      },
      "hasMap":
        "https://www.google.com/maps?q=2153+W+Picacho+Ave,+Las+Cruces,+NM+88077"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.effyexotics.com/" },
        { "@type": "ListItem", "position": 2, "name": "Las Cruces", "item": "https://www.effyexotics.com/las-cruces" },
        { "@type": "ListItem", "position": 3, "name": "Directions", "item": canonical }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Directions & Map — Las Cruces"
        description="Find Effy Exotics in Las Cruces, NM. Get directions, view our location on Google Maps, and see store hours."
        image="/img/social-preview.jpg"
        type="website"
        jsonLd={jsonLd}
        canonical={canonical}
      />

      <Header />

      <main className="map page">
        {/* Map embed */}
        <section className="map-embed" aria-label="Map">
  <div>
    <iframe
      title="Effy Exotics Location"
      src={embedSrc}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</section>


        {/* Info panel */}
        <section className="int-main-section">
          <h1>Directions</h1>
          <div>
            <img className="icon" src="/img/effy-dispensary.svg" alt="Effy Exotics icon" />
            <div className="map-text">
              <h2>New Mexico&apos;s Hottest Dispensary</h2>
              <p>{addressLine}</p>
              <a href={`tel:${telHref}`}>{telPretty}</a>

              <h2 style={{ marginTop: 24 }}>Dispensary Hours</h2>
              <p>
                Saturday 7:00 AM – 11:30 PM<br />
                Sunday 10:00 AM – 11:30 PM<br />
                Monday–Friday 7:00 AM – 11:30 PM
              </p>

              <p style={{ marginTop: 24 }}>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    addressLine
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#C09B31", textDecoration: "none" }}
                >
                  Open in Google Maps →
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
