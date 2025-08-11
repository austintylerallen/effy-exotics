// src/pages/coming-soon.js
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function ComingSoon() {
  const title = "Coming Soon – Effy Exotics";
  const desc  = "This page is being prepped. Check back soon or visit our live Las Cruces menu.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.effyexotics.com/coming-soon" />
      </Head>

      <main style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <Link href="/" aria-label="Effy Exotics Home">
              <Image
                src="/img/effy-dispensary.svg"
                alt="Effy Exotics"
                width={160}
                height={48}
                priority
              />
            </Link>
          </div>

          <h1 style={styles.title}>Coming&nbsp;Soon</h1>
          <p style={styles.text}>
            We’re getting this page ready for Alamogordo. In the meantime, our Las Cruces location is live.
          </p>

          <div style={styles.btnRow}>
            <Link href="/" style={{ ...styles.btn, ...styles.btnGhost }}>
              Back Home
            </Link>
            <Link href="/las-cruces/shop" style={{ ...styles.btn, ...styles.btnPrimary }}>
              View Las Cruces Menu
            </Link>
          </div>

          <p style={styles.help}>
            Need help?{" "}
            <a href="mailto:austintallen07@gmail.com" style={styles.link}>
              Contact support
            </a>
          </p>
        </div>
      </main>
    </>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#121620",
    padding: "32px",
    color: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "28px 24px 32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },
  logoWrap: { display: "flex", justifyContent: "center", marginBottom: 12 },
  title: {
    fontSize: "40px",
    lineHeight: 1.1,
    margin: "8px 0 10px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  text: { opacity: 0.8, margin: "0 0 18px", fontSize: 16 },
  btnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 8,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 700,
    textDecoration: "none",
    transition: "all .2s ease",
  },
  btnPrimary: {
    background: "#cca050",
    color: "#000",
    border: "1px solid #bd8f42",
  },
  btnGhost: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  help: { marginTop: 16, opacity: 0.6, fontSize: 12 },
  link: { color: "#cca050", textDecoration: "underline" },
};
