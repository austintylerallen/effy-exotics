import Link from "next/link";
import { useRouter } from "next/router";
import { track } from "../lib/track";

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

  return (
    <div className={`cta-buttons ${className}`}>
      {shopUrl && (/^(https?:)?\/\//i.test(shopUrl) ? (
        <a href={shopUrl} onClick={onShopExternal} className="btn btn-primary">
          Shop Now
        </a>
      ) : (
        <Link href={shopUrl} onClick={onShopInternal} className="btn btn-primary">
          Shop Now
        </Link>
      ))}

      <Link href={mapHref} onClick={onDirections} className="btn btn-secondary">
        Get Directions
      </Link>

      {telHref && (
        <a href={telHref} onClick={onCall} className="btn btn-tertiary">
          Call {phone}
        </a>
      )}
    </div>
  );
}
