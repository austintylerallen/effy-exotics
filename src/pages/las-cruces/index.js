// src/pages/las-cruces/index.js
import Head from "next/head";
import Image from "next/image";             // <-- NEW
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Effy Exotics - Premium Cannabis in Las Cruces, NM</title>
        <meta
          name="description"
          content="Effy Exotics is a top cannabis dispensary in Las Cruces, NM, offering premium cannabis products including flower, edibles, concentrates, and CBD."
        />
      </Head>

      <Header />

      <main>
        {/* Age Verification (left as-is) */}
        <div id="age-popup" className="popup">
          <div className="popup-content">
            <h2>Age Verification</h2>
            <p>You must be at least 21 years old to enter this site.</p>
            <button id="yes-button">I am 21 or older</button>
            <button id="no-button">I am under 21</button>
          </div>
        </div>

        {/* Hero (converted to next/image) */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg" // highest-res source; Next will generate responsive sizes
              alt="Effy Exotics"
              fill
              priority
              sizes="100vw"          // tells Next to serve the right width for full-bleed hero
            />
          </div>

          <h1>
            Effy <span className="last-h1">Exotics</span>
          </h1>
        </section>

        {/* Welcome */}
        <section className="hpt">
          <h2>
            Welcome To <span className="second">Effy Exotics</span>
          </h2>
          <p>Welcome to Effy Exotics Dispensary in the lively city of Las Cruces...</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
