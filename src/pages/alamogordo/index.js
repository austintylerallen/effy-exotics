// src/pages/alamogordo/index.js
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AlamogordoHome() {
  return (
    <>
      <Head>
        <title>Effy Exotics - Alamogordo, NM</title>
        <meta
          name="description"
          content="Effy Exotics Alamogordo—premium cannabis products, friendly service, and local expertise."
        />
      </Head>
      <Header />

      <main>
        <section className="hero-shot">
          <img src="/img/homepage/hp-img-1-1200.jpg" alt="Effy Exotics Alamogordo" />
          <h1>Effy <span className="last-h1">Alamogordo</span></h1>
        </section>

        <section className="hpt">
          <h2>Welcome To <span className="second">Effy Exotics Alamogordo</span></h2>
          <p>Serving Alamogordo with top-shelf flower, edibles, concentrates, and more…</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
