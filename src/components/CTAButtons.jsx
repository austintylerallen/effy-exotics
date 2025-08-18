// src/components/CTAButtons.jsx
import Link from "next/link";
import * as analytics from "../lib/analytics"; // uses pageview/gaEvent/withUTM we restored

function phoneToTel(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits ? `+1${digits}` : "";
}

export default function CTAButtons({
  location = "las-cruces",             // "las-cruces" | "alamogordo"
  address,                             // "2153 W Picacho Ave, Las Cruces, NM 88007"
  phone,                               // "(575) 652-4619"
  shopUrl,                             // "/las-cruces/shop" or external Dutchie URL
  className = "",
}) {
  const tel = phoneToTel(phone);
  const telHref = tel ? `tel:${tel}` : undefined;

  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "/map";

  // shop: UTM-tag the URL (safe for both internal and external)
  const resolvedShop = shopUrl
    ? analytics.withUTM(shopUrl, { utm_campaign: "shop-cta", utm_content: location })
    : undefined;

  const handleShop = () => {
    analytics.gaEvent("shop_click", {
      location,
      dest: resolvedShop,
    });
  };

  const handleCall = () => {
    analytics.gaEvent("call_click", {
      location,
      phone: tel,
      dest: telHref,
    });
  };

  const handleDirections = () => {
    analytics.gaEvent("directions_click", {
      location,
      address,
      dest: mapsHref,
    });
  };

  return (
    <div className={`ee-cta-buttons ${className}`}>
      {/* SHOP */}
      {resolvedShop && resolvedShop.startsWith("/")
        ? (
          <Link href={resolvedShop} className="btn btn-shop" onClick={handleShop}>
            Shop Now
          </Link>
        ) : resolvedShop ? (
          <a
            href={resolvedShop}
            className="btn btn-shop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShop}
          >
            Shop Now
          </a>
        ) : null}

      {/* CALL */}
      {telHref && (
        <a href={telHref} className="btn btn-call" onClick={handleCall}>
          Call Us
        </a>
      )}

      {/* DIRECTIONS */}
      <a
        href={mapsHref}
        className="btn btn-directions"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDirections}
      >
        Directions
      </a>
    </div>
  );
}
