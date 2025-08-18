// src/pages/admin/analytics.js
export default function AnalyticsDashboard() {
    const REPORT_URL =
      process.env.NEXT_PUBLIC_LOOKER_STUDIO_URL ||
      "https://lookerstudio.google.com/embed/reporting/REPLACE_ME";
  
    return (
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "1.875rem", marginBottom: "1rem" }}>
          Effy Exotics — SEO & Analytics
        </h1>
        <p style={{ marginBottom: "1rem", opacity: .85 }}>
          Live KPIs, Search Console queries, and Core Web Vitals. Use page filters to compare
          <strong> Las Cruces</strong> vs <strong> Alamogordo</strong>.
        </p>
        <div style={{ position: "relative", paddingTop: "62.5%" }}>
          <iframe
            title="Looker Studio – Effy Exotics"
            src={REPORT_URL}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
          />
        </div>
      </main>
    );
  }
  