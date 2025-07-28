// src/components/SEO.js
import Head from "next/head";
import { useRouter } from "next/router";
import SITE from "../lib/seo";  // <— default import

export default function SEO({
  title,
  description,
  image,
  type = "website",
  canonical,
  jsonLd,
  noindex = false,
}) {
  const { asPath } = useRouter();

  // Optional safety fallback if import ever fails in dev
  const S = SITE || {
    name: "Effy Exotics",
    url: "",
    defaultTitle: "Effy Exotics – Cannabis Dispensary in Las Cruces, NM",
    defaultDescription:
      "Discover Effy Exotics, Las Cruces' premium cannabis dispensary.",
    ogImage: "/img/social-preview.jpg",
    locale: "en_US",
  };

  const metaTitle = title ? `${title} | ${S.name}` : S.defaultTitle;
  const metaDesc = description || S.defaultDescription;
  const metaImage = image || S.ogImage;
  const url = canonical || `${S.url}${asPath === "/" ? "" : asPath}`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={S.name} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:locale" content={S.locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
