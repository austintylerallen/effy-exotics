// src/components/CTAButtons.jsx
import React from "react";
import { withUTM, gaEvent } from "../lib/analytics";

function digitsOnly(str = "") {
  const d = String(str).replace(/\D/g, "");
  if (!d) return "";
  return d.length === 10 ? `+1${d}` : (d.startsWith("+") ? d : `+${d}`);
}

export default function CTAButtons({
  address = "",
  phone = "",
  shopUrl = "",
  location = "site", // 'las-cruces' | 'alamogordo'
  className = "",
}) {
  // Directions
  const mapsDest = address ? encodeURIComponent(address) : "";
  const directionsRaw = mapsDest
    ? `https://www.google.com/maps/dir/?api=1&destination=${mapsDest}`
    : `https://www.google.com/maps/search/?api=1&q=Effy%20Exotics`;
  const directionsHref = withUTM(directionsRaw, {
    utm_content: `${location}-directions`,
  });

  // Call
  const tel = digitsOnly(phone);
  const callHref = tel ? `tel:${tel}` : undefined;

  // Shop
  const shopRaw =
    shopUrl ||
    (typeof process !== "undefined" &&
      (location === "alamogordo"
        ? process.env.NEXT_PUBLIC_ALAMO_SHOP_URL || "/coming-soon"
        : process.env.NEXT_PUBLIC_LC_SHOP_URL || "/las-cruces/shop")) ||
    "/";

  const shopHref = withUTM(shopRaw, {
    utm_content: `${location}-shop`,
  });

  const onClick = (name, extras = {}) =>
    gaEvent(`${name}_click`, {
      location,
      dest: extras.dest || "",
    });

  return (
    <div className={`cta-buttons ${className}`}>
      <a
        className="btn btn-shop"
        href={shopHref}
        onClick={() => onClick("shop", { dest: shopHref })}
      >
        Shop
      </a>

      <a
        className="btn btn-directions"
        href={directionsHref}
        target="_blank"
        rel="noopener"
        onClick={() => onClick("directions", { dest: directionsHref })}
      >
        Directions
      </a>

      {callHref && (
        <a
          className="btn btn-call"
          href={callHref}
          onClick={() => onClick("call", { dest: callHref })}
        >
          Call
        </a>
      )}
    </div>
  );
}
