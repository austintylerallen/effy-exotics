// src/pages/las-cruces/index.js
import Head from "next/head";
import Image from "next/image";
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
        {/* Hero */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics"
              fill
              priority
              sizes="100vw"
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
