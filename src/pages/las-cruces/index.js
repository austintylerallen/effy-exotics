// src/pages/las-cruces/index.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import Image from "next/image";
import SubscribeForm from "../../components/SubscribeForm";
import Link from "next/link";

/* ── location constants ──────────────────────────────────── */
const LS_CANON = "https://www.effyexotics.com/las-cruces";
const LS_ADDR = "2153 W Picacho Ave, Las Cruces, NM 88077";
const LS_TEL = "+15756524619";
const LS_TEL_FMT = "(575) 652-4619";
const LS_HOURS = [
  { days: "Mon–Fri", hours: "07:00–23:30" },
  { days: "Sat", hours: "07:00–23:30" },
  { days: "Sun", hours: "10:00–23:30" },
];
/* ─────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <SEO
        title="Effy Exotics | Las Cruces Cannabis Dispensary"
        description="Shop premium flower, edibles, vapes & concentrates at Effy Exotics — Las Cruces’ go-to dispensary."
        canonical={LS_CANON}
        image="/img/social-preview.jpg"
        type="website"
        jsonLd={[{ /* your JSON-LD here */ }]}
      />

      <Header />

      <main className="page-container">
        {/* ── SPLIT HERO ───────────────────────────────────────────── */}
        <section className="split-hero">
  <div className="text-panel">
    <div className="text-content">
      <h1>
        EFFY EXOTICS<br />
        <span className="highlight">LAS CRUCES</span>
      </h1>
      <p className="subheading">Your premier cannabis dispensary</p>
      <a href="#shop" className="btn-primary">Shop Now</a>
    </div>
  </div>

  <div className="carousel-panel">
    <div className="carousel">
      <Image
        src="/img/homepage/hp-img-1-2200.jpg"
        alt="Effy Product"
        fill
        priority
      />
      {/* Add carousel logic here later */}
    </div>
  </div>
</section>



        {/* ── INTRO ──────────────────────────────────────────── */}
        <section className="intro-card">
          <h2>Welcome to Effy Exotics Las Cruces</h2>
          <p>
            Discover a hand-selected menu of boutique flower,
            chef-crafted edibles, solvent-free vapes, potent concentrates,
            and therapeutic CBD...
          </p>
        </section>

        {/* ── INFO GRID ───────────────────────────────────────── */}
        <section className="info-grid">
          <article className="info-item">
            <h3>Location</h3>
            <p>{LS_ADDR}</p>
            <Link href={`https://maps.google.com/?q=${encodeURIComponent(LS_ADDR)}`} className="link-text">
              Get Directions
            </Link>
          </article>
          <article className="info-item">
            <h3>Call Us</h3>
            <p><a href={`tel:${LS_TEL}`} className="link-text">{LS_TEL_FMT}</a></p>
          </article>
          <article className="info-item">
            <h3>Hours</h3>
            <ul>
              {LS_HOURS.map((o) => (
                <li key={o.days}>{o.days}: {o.hours}</li>
              ))}
            </ul>
          </article>
          <article className="info-item">
            <h3>Join Our List</h3>
            <SubscribeForm city="las-cruces" />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
