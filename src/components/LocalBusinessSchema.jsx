// src/components/LocalBusinessSchema.jsx
import Head from "next/head";

export default function LocalBusinessSchema({
  name = "Effy Exotics — Las Cruces",
  url = "https://www.effyexotics.com/las-cruces",
  image = "https://www.effyexotics.com/img/effy-dispensary.svg",
  telephone = "+1-575-652-4619",
  streetAddress = "2153 W Picacho Ave",
  addressLocality = "Las Cruces",
  addressRegion = "NM",
  postalCode = "88077",
  latitude = 32.311383948399154,
  longitude = -106.80641921326792,
  priceRange = "$$",
  hasMap,                // optional: Google Maps URL
  geo,                   // optional: { latitude, longitude }
} = {}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CannabisDispensary",
    "@id": `${url}#store-las-cruces`,
    name,
    url,
    image,
    telephone,
    priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "23:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "07:00",
        closes: "23:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "23:30",
      },
    ],
  };

  if (hasMap) data.hasMap = hasMap;
  if (geo) data.geo = { "@type": "GeoCoordinates", ...geo };

  return (
    <Head>
      <script
        type="application/ld+json"
        // stringify once, no functions
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}
