// src/pages/index.js
import SEO from "../components/SEO";
import Image from "next/image";

export default function ChooseLocation() {
  function choose(city) {
    // persist for ~6 months
    document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
    window.location.href = city === "alamogordo" ? "/alamogordo" : "/las-cruces";
  }

  return (
    <>
      <SEO
        title="Choose Your Effy Exotics Location"
        description="Choose your Effy Exotics store: Las Cruces or Alamogordo. We&apos;ll remember your choice for next time."
        canonical="https://www.effyexotics.com/"
      />

      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div>
          <Image
            src="/img/effy-dispensary.svg"
            alt="Effy Exotics"
            width={140}
            height={140}
            style={{ margin: "0 auto 24px", height: "auto" }}
          />

          <h1 style={{ marginBottom: 8 }}>Choose Your Store</h1>
          <p style={{ opacity: 0.8, marginBottom: 24 }}>
            We&apos;ll remember this for next time.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button onClick={() => choose("las-cruces")} style={btn}>
              Las Cruces
            </button>
            <button onClick={() => choose("alamogordo")} style={btn}>
              Alamogordo
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

const btn = {
  padding: "12px 20px",
  border: "1px solid #C09B31",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  letterSpacing: "2px",
  textTransform: "uppercase",
};
