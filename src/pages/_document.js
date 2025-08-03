// src/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;      // e.g. G-XXXXXXXX
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;     // e.g. GTM-XXXXXXX

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* makes 1 CSS px ≈ 1 device px */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />

        {/* ——— Optional standalone GA4 (skip if you fire GA via GTM) ——— */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              // GA init
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </Head>

      <body>
        {/* ——— GTM noscript (required for <noscript> browsers) ——— */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
