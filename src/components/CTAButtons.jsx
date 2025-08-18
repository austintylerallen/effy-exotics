import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Reusable CTA cluster that pushes GTM custom events:
 * - shop_click
 * - directions_click
 * - call_click
 *
 * Props:
 *  - address   (string, required for Directions)
 *  - phone     (string like "(575) 652-4619" — optional; omit to hide button)
 *  - shopUrl   (string: internal "/las-cruces/shop" or external Dutchie URL)
 *  - location  (string: "las-cruces" | "alamogordo")
 *  - className (optional)
 */
export default function CTAButtons({
  address = "",
  phone,
  shopUrl,
  location = "",
  className = "",
}) {
  const router = useRouter();

  // Normalize phone to tel: format
  const phoneDigits = String(phone || "").replace(/\D/g, "");
  const telHref = phoneDigits ? `tel:+1${phoneDigits}` : "";

  // Internal map page for each city
  const mapHref =
    location === "alamogordo"
      ? "/alamogordo/map"
      : location === "las-cruces"
      ? "/las-cruces/map"
      : "/map";

  // Helper: push to dataLayer safely
  const pushEvent = (event, extra = {}) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      location,
      ...extra,
    });
  };

  // SHOP — supports internal (Next) or external (Dutchie) URLs
  const onShop = (e) => {
    if (!shopUrl) return;
    const dest = shopUrl;
    const isExternal = /^(https?:)?\/\//i.test(dest);

    pushEvent("shop_click", { dest });

    if (isExternal) {
      // Delay a hair so GTM can flush the event before the navigation
      e.preventDefault();
      setTimeout(() => {
        window.location.href = dest;
      }, 200);
    } // internal <Link> handles navigation
  };

  // DIRECTIONS — internal page; let Link navigate
  const onDirections = () => {
    pushEvent("directions_click", { address, dest: mapHref });
  };

  // CALL — tel: link; push first, then allow native dialer prompt
  const onCall = () => {
    if (!telHref) return;
    pushEvent("call_click", { phone: phoneDigits, dest: telHref });
  };

  /* Render */
  return (
    <div className={`cta-buttons ${className}`}>
      {/* Shop */}
      {shopUrl && (
        <>
          {/^https?:\/\//i.test(shopUrl) ? (
            <a href={shopUrl} onClick={onShop} className="btn btn-primary">
              Shop Now
            </a>
          ) : (
            <Link href={shopUrl} onClick={onShop} className="btn btn-primary">
              Shop Now
            </Link>
          )}
        </>
      )}

      {/* Directions */}
      <Link href={mapHref} onClick={onDirections} className="btn btn-secondary">
        Get Directions
      </Link>

      {/* Call (only if phone present) */}
      {telHref && (
        <a href={telHref} onClick={onCall} className="btn btn-tertiary">
          Call {phone}
        </a>
      )}
    </div>
  );
}
