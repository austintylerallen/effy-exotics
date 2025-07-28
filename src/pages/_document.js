// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon / icons */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          {/* PNG fallbacks (add these files when you have them) */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          {/* Apple touch icon (add this PNG when you have it) */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          {/* Safari pinned tab */}
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#C09B31" />
          {/* Web App Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
          {/* Brand color for Android address bar / Windows tiles */}
          <meta name="theme-color" content="#000000" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
