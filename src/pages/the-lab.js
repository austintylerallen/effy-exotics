import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TheLab() {
  return (
    <>
      <Head>
        <title>The Lab - Effy Exotics</title>
      </Head>
      <Header />
      <main className="the_lab page">
        <section className="top-image">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/thelab.jpeg" />
            <source media="(min-width: 768px)" srcSet="/img/thelab1200.jpeg" />
            <img src="/img/thelab767.jpeg" alt="The Lab" />
          </picture>
        </section>
        <section className="int-main-section">
          <h1>The Lab</h1>
          <div>
            <img className="icon" src="/img/effy-dispensary.svg" alt="exclusives" />
            <div>
              <h2>New Mexico's Hottest Dispensary</h2>
              <p>Welcome to Effy Exotics Grow House, where cultivation meets excellence...</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
