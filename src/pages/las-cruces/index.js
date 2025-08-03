import Head   from "next/head";
import Image  from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SubscribeForm from "../../components/SubscribeForm";   // ⬅️ NEW

export default function Home() {
  return (
    <>
      <Head>
        <title>Effy Exotics | Las Cruces Cannabis Dispensary</title>
        <meta
          name="description"
          content="Effy Exotics is the go-to cannabis dispensary in Las Cruces, NM. Shop premium flower, edibles, pre-rolls, vapes, and CBD products today."
        />
        <meta
          name="keywords"
          content="cannabis Las Cruces, weed Las Cruces, dispensary Las Cruces, marijuana Las Cruces, Effy Exotics, CBD Las Cruces"
        />
        <meta name="robots" content="index, follow" />

        {/* LocalBusiness Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CannabisDispensary",
            name: "Effy Exotics",
            image: "https://effyexotics.com/img/effy-dispensary.svg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Dispensary Lane", // Replace with real address
              addressLocality: "Las Cruces",
              addressRegion: "NM",
              postalCode: "88001",
              addressCountry: "US",
            },
            url: "https://effyexotics.com/las-cruces",
            telephone: "+1-575-555-5555", // Replace with real number
            openingHours: "Mo-Su 09:00-21:00",
          })}
        </script>
      </Head>

      <Header />

      <main>
        {/* Hero */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics Las Cruces Dispensary"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <h1>
            Las Cruces&nbsp;<span className="last-h1">Cannabis Dispensary</span>
          </h1>
        </section>

        
        {/* Welcome */}
        <section className="hpt">
          <h2>
            Welcome to <span className="second">Effy Exotics Las Cruces</span>
          </h2>
          <p>
            Effy Exotics is proud to serve the Las Cruces community with top-tier cannabis
            products including flower, edibles, vapes, concentrates, and CBD. Whether
            you&apos;re a medical patient or recreational user, our team is here to guide you
            through a premium dispensary experience.
          </p>
        </section>

        {/* ─── capture widget ───────────────────────────────────────── */}
        <SubscribeForm />



      </main>

      <Footer />
    </>
  );
}
