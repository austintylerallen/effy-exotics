import Link from "next/link";
import { useRouter } from "next/router";
import { track } from "../lib/track";
import styles from "./CTAButtons.module.css";

export default function CTAButtons({
  address = "",
  phone,
  shopUrl,
  location = "",
  className = "",
}) {
  const router = useRouter();
  const phoneDigits = String(phone || "").replace(/\D/g, "");
  const telHref = phoneDigits ? `tel:+1${phoneDigits}` : "";

  const mapHref =
    location === "alamogordo" ? "/alamogordo/map"
    : location === "las-cruces" ? "/las-cruces/map"
    : "/map";

  const navAfter = (dest) => setTimeout(() => router.push(dest), 120);

  const onShopExternal = (e) => {
    const dest = shopUrl;
    track("shop_click", { location, dest });
    e.preventDefault();
    setTimeout(() => { window.location.href = dest; }, 200);
  };

  const onShopInternal = (e) => {
    const dest = shopUrl;
    track("shop_click", { location, dest });
    e.preventDefault();
    navAfter(dest);
  };

  const onDirections = (e) => {
    track("directions_click", { location, address, dest: mapHref });
    e.preventDefault();
    navAfter(mapHref);
  };

  const onCall = () => {
    if (!telHref) return;
    track("call_click", { location, phone: phoneDigits, dest: telHref });
    // allow the tel: to proceed naturally
  };

  const isExternal = shopUrl && /^(https?:)?\/\//i.test(shopUrl);

  return (
    <div className={`${styles.ctaButtons} ${className}`}>
      {shopUrl && (isExternal ? (
        <a
          href={shopUrl}
          onClick={onShopExternal}
          className={`${styles.btn} ${styles.primary}`}
          aria-label="Shop Now"
        >
          <span className={styles.icon} aria-hidden="true">
            {/* cart icon */}
            <svg viewBox="0 0 24 24"><path d="M7 4h-2a1 1 0 000 2h1.2l2.1 8.4A2 2 0 0010.3 16h6.6a2 2 0 001.9-1.4L21 8H8.3l-.4-2H20a1 1 0 100-2H7zm3 15a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/></svg>
          </span>
          Shop Now
        </a>
      ) : (
        <Link
          href={shopUrl}
          onClick={onShopInternal}
          className={`${styles.btn} ${styles.primary}`}
          aria-label="Shop Now"
        >
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 4h-2a1 1 0 000 2h1.2l2.1 8.4A2 2 0 0010.3 16h6.6a2 2 0 001.9-1.4L21 8H8.3l-.4-2H20a1 1 0 100-2H7zm3 15a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/></svg>
          </span>
          Shop Now
        </Link>
      ))}

      <Link
        href={mapHref}
        onClick={onDirections}
        className={`${styles.btn} ${styles.secondary}`}
        aria-label="Get Directions"
      >
        <span className={styles.icon} aria-hidden="true">
          {/* pin icon */}
          <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>
        </span>
        Get Directions
      </Link>

      {telHref && (
        <a
          href={telHref}
          onClick={onCall}
          className={`${styles.btn} ${styles.tertiary}`}
          aria-label={`Call ${phone}`}
        >
          <span className={styles.icon} aria-hidden="true">
            {/* phone icon */}
            <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.2 11.2 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.2 11.2 0 00.56 3.5 1 1 0 01-.25 1L6.6 10.8z"/></svg>
          </span>
          Call {phone}
        </a>
      )}
    </div>
  );
}
