// src/components/CTAButtons.jsx
import { withUTM, track } from "../lib/analytics";

export default function CTAButtons({
  address,          // "2153 W Picacho Ave, Las Cruces, NM 88077"
  phone,            // "(575) 652-4619" — optional; hides Call if missing
  shopUrl,          // Dutchie or internal /{city}/shop — optional
  location,         // "las-cruces" | "alamogordo"
  className = "",
}) {
  const telDigits = String(phone || "").replace(/\D/g, "");
  const telHref = telDigits ? `tel:+1${telDigits}` : undefined;

  const directionsHref = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : "https://maps.google.com";

  const shopHref = shopUrl
    ? withUTM(shopUrl, { utm_campaign: "shop_button", utm_content: `${location}_hero` })
    : undefined;

  return (
    <div className={`cta-row ${className}`}>
      {shopHref && (
        <a
          className="btn"
          href={shopHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("shop_click", { location, dest: shopHref })}
        >
          Shop Now
        </a>
      )}

      <a
        className="btn"
        href={directionsHref}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("directions_click", { location, address })}
      >
        Get Directions
      </a>

      {telHref && (
        <a
          className="btn btn-outline"
          href={telHref}
          onClick={() => track("call_click", { location, phone: `+1${telDigits}` })}
        >
          Call Now
        </a>
      )}

      <style jsx>{`
        .cta-row { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1rem; }
        .btn { padding: .75rem 1rem; border-radius: 12px; background: #cca050; color: #121620; font-weight: 600; }
        .btn.btn-outline { background: transparent; color: #cca050; border: 1px solid #cca050; }
      `}</style>
    </div>
  );
}
