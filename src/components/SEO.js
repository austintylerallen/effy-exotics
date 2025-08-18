// src/components/SEO.js
import Head from "next/head";
import { useRouter } from "next/router";
import SITE from "../lib/seo";

function absoluteUrl(input, base) {
  if (!input) return "";
  try {
    return new URL(input, base).href;
  } catch {
    return input; // fall back (shouldn’t happen in practice)
  }
}

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

  const S = SITE || {
    name: "Effy Exotics",
    url: "https://www.effyexotics.com",
    defaultTitle: "Effy Exotics – Cannabis Dispensary in New Mexico",
    defaultDescription:
      "Shop premium flower, vapes, edibles & concentrates at Effy Exotics.",
    ogImage: "/img/social-preview.jpg",
    locale: "en_US",
    twitter: "@effyexotics",
  };

  // If the provided title already includes the brand, don’t append it again
  const alreadyBranded =
    title && new RegExp(`\\b${S.name}\\b`, "i").test(title);
  const metaTitle = title
    ? alreadyBranded
      ? title
      : `${title} | ${S.name}`
    : S.defaultTitle;

  const metaDesc = description || S.defaultDescription;

  const baseUrl = S.url.replace(/\/$/, "");
  const url = canonical || `${baseUrl}${asPath === "/" ? "" : asPath}`;

  const img = image || S.ogImage;
  const metaImage = absoluteUrl(img, baseUrl);

  // Allow array OR single object for JSON-LD; emit one <script> per object
  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title>{metaTitle}</title>

      <meta
        name="robots"
        content={
          noindex
            ? "noindex,nofollow"
            : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        }
      />
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={S.name} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:locale" content={S.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={S.twitter} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD */}
      {jsonLdArray.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </Head>
  );
}
