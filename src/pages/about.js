import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Effy Exotics</title>
      </Head>
      <Header />
      <main className="about page">
        <section className="top-image">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/about.jpeg" />
            <source media="(min-width: 768px)" srcSet="/img/about1200.jpeg" />
            <img className="img" src="/img/about767.jpeg" alt="About Effy Exotics" />
          </picture>
        </section>
        <section className="int-main-section">
          <h1>About Us</h1>
          <div>
            <img className="icon" src="/img/effy-dispensary.svg" alt="exclusives logo" />
            <div>
              <h2>New Mexico's Hottest Dispensary</h2>
              <p>Welcome to Effy Exotics, your premier destination for top-quality cannabis...</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
