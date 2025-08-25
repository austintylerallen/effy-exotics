import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "./coming-soon.module.css";

export default function ComingSoon() {
  const title = "Coming Soon – Effy Exotics (Alamogordo)";
  const desc =
    "Our Alamogordo online menu is coming soon. You can visit us now at 1408 Black Street, Alamogordo, NM 88310. The Las Cruces online menu is live.";

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

      <main className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.logoWrap}>
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

          <h1 className={styles.title}>Alamogordo Menu Coming&nbsp;Soon</h1>

          <p className={styles.text}>
            We’re putting the finishing touches on our{" "}
            <strong>online menu for Alamogordo</strong>. You can{" "}
            <strong>visit the store in person today</strong>:
          </p>

          <address className={styles.addr}>
            1408 Black Street
            <br />
            Alamogordo, NM 88310
          </address>

          <p className={styles.text}>
            In the meantime, our{" "}
            <Link href="/las-cruces/shop" className={styles.link}>
              Las Cruces online menu
            </Link>{" "}
            is live.
          </p>

          <div className={styles.btnRow}>
            <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
              Back Home
            </Link>

            {/* UPDATED: route internally to the map page */}
            <Link
              href="/alamogordo/map"
              className={`${styles.btn} ${styles.btnGhost}`}
              aria-label="Get directions to Effy Exotics Alamogordo"
            >
              Get Directions
            </Link>

            <Link
              href="/las-cruces/shop"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              View Las Cruces Menu
            </Link>
          </div>

          {/* <p className={styles.help}>
            Need help?{" "}
            <a href="mailto:austintallen07@gmail.com" className={styles.link}>
              Contact support
            </a>
          </p> */}
        </div>
      </main>
    </>
  );
}
