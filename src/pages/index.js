import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
        {/* Age Verification */}
        <div id="age-popup" className="popup">
          <div className="popup-content">
            <h2>Age Verification</h2>
            <p>You must be at least 21 years old to enter this site.</p>
            <button id="yes-button">I am 21 or older</button>
            <button id="no-button">I am under 21</button>
          </div>
        </div>

        {/* Hero */}
        <section className="hero-shot">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/homepage/hp-img-1-2200.jpg" />
            <source media="(min-width: 768px)" srcSet="/img/homepage/hp-img-1-1200.jpg" />
            <source media="(max-width: 767px)" srcSet="/img/homepage/hp-img-1-765.jpg" />
            <img src="/img/homepage/hp-img-1-2200.jpg" alt="Effy Exotics" />
          </picture>
          <h1>Effy <span className="last-h1">Exotics</span></h1>
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
