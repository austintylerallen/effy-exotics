// src/components/WebsiteSchema.jsx
import Head from "next/head";

export default function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Effy Exotics",
    "url": "https://www.effyexotics.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.effyexotics.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}
