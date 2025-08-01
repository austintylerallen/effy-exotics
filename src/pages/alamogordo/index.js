import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO    from "../../components/SEO";
import Image  from "next/image";
import { ALAMO_ADDR, ALAMO_TEL, ALAMO_HOURS, ALAMO_CANON, ALAMO_IMG } from "./_constants";

export default function Home() {
  return (
    <>
      <SEO
        title="Effy Exotics | Alamogordo Cannabis Dispensary"
        description="Shop flower, edibles, vapes & concentrates at Effy Exotics—Alamogordo’s go-to dispensary."
        image={ALAMO_IMG}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CannabisDispensary",
            name: "Effy Exotics — Alamogordo",
            url: ALAMO_CANON,
            telephone: ALAMO_TEL,
            openingHours: ALAMO_HOURS,
            image: "https://effyexotics.com/img/effy-dispensary.svg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1408 Black St",
              addressLocality: "Alamogordo",
              addressRegion: "NM",
              postalCode: "88310",
              addressCountry: "US"
            }
          }
        ]}
      />

      <Header />

      <main>
        {/* hero */}
        <section className="hero-shot">
          <div className="hero-media">
            <Image
              src="/img/homepage/hp-img-1-2200.jpg"
              alt="Effy Exotics Alamogordo Dispensary"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <h1>
            Alamogordo&nbsp;<span className="last-h1">Cannabis Dispensary</span>
          </h1>
        </section>

        {/* intro */}
        <section className="hpt">
          <h2>
            Welcome to <span className="second">Effy Exotics Alamogordo</span>
          </h2>
          <p>
            Effy Exotics proudly serves Alamogordo with top-tier cannabis products—flower,
            edibles, vapes, concentrates and CBD. Medical or recreational, our team
            will guide you through a premium dispensary experience.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
