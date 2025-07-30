import Head from "next/head";

export default function ChooseLocation() {
  function choose(city) {
    // persist for ~6 months
    document.cookie = `ee_city=${city}; max-age=${60*60*24*180}; path=/; samesite=lax`;
    window.location.href = city === "alamogordo" ? "/alamogordo" : "/las-cruces";
  }

  return (
    <>
      <Head>
        <title>Choose Your Effy Exotics Location</title>
        <meta name="robots" content="index, follow" />

      </Head>

      <main style={{minHeight:"70vh", display:"grid", placeItems:"center", textAlign:"center", padding:"40px"}}>
        <div>
          <img src="/img/effy-dispensary.svg" alt="Effy Exotics" style={{width:140, margin:"0 auto 24px"}} />
          <h1 style={{marginBottom:8}}>Choose Your Store</h1>
          <p style={{opacity:.8, marginBottom:24}}>We’ll remember this for next time.</p>

          <div style={{display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap"}}>
            <button onClick={() => choose("las-cruces")} style={btn}>Las Cruces</button>
            <button onClick={() => choose("alamogordo")} style={btn}>Alamogordo</button>
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
  textTransform: "uppercase"
};
