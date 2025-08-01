import { useEffect, useState } from "react";
import Link   from "next/link";
import Image  from "next/image";
import { useRouter } from "next/router";

/* ---------- utils (same cookie helper) ------------------------------ */
const ONE_DAY = 86400;
const SIX_MO  = 180 * ONE_DAY;

function setCityCookie(city) {
  if (typeof document === "undefined") return;
  document.cookie = `ee_city=${city}; path=/; max-age=${SIX_MO}; SameSite=Lax`;
}
function getCityFromCookie() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
  return m ? m[1] : "";
}
function getCityFromPath(path) {
  if (path.startsWith("/las-cruces"))  return "las-cruces";
  if (path.startsWith("/alamogordo"))  return "alamogordo";
  return "";
}
/* -------------------------------------------------------------------- */

export default function Footer() {
  const { pathname, push, asPath } = useRouter();

  const pathCity = getCityFromPath(pathname);
  const [cookieCity, setCookieCity] = useState("");
  useEffect(() => setCookieCity(getCityFromCookie()), []);
  const city = pathCity || cookieCity || "las-cruces";

  /* data per city */
  const info = city === "alamogordo"
    ? { addr:"1408 Black St, Alamogordo, NM 88310", tel:"TBD", telPretty:"Coming Soon", base:"/alamogordo" }
    : { addr:"2153 W Picacho Ave, Las Cruces, NM 88077", tel:"+15756524619", telPretty:"575-652-4619", base:"/las-cruces" };

  /* switcher click */
  const switchTo = (target) => {
    setCityCookie(target);
    const newPath = asPath.replace(/^\/(las\-cruces|alamogordo)/, `/${target}`);
    push(newPath);
  };

  return (
    <footer>
      <Link href={info.base} className="link-n-logo" aria-label="Effy Exotics Home">
        <Image src="/img/effy-dispensary.svg" alt="Effy Exotics logo" width={160} height={160} priority={false} style={{ margin:"auto" }} />
      </Link>

      {/* address + phone */}
      <p style={{ marginTop:16, fontSize:18, lineHeight:1.4 }}>
        {info.addr}<br/>
        📞&nbsp;{info.tel === "TBD" ? info.telPretty : <a href={`tel:${info.tel}`} style={{ color:"#fff" }}>{info.telPretty}</a>}
      </p>

      <p className="copyright">©2024 EFFY EXOTICS.<br/>All rights reserved.</p>

      <p className="trademark">
        The content, design, graphics, and other materials on this website are protected by
        copyright and other intellectual property laws. Any unauthorized reproduction,
        distribution, or modification is strictly prohibited.
      </p>

      {/* location links */}
      <p style={{ marginTop:32, fontFamily:"Legend-M54" }}>
        <button onClick={() => switchTo("las-cruces")}  style={{ background:"none",border:0,color: city==="las-cruces"  ? "#C09B31" : "#fff",cursor:"pointer" }}>Las Cruces</button>{" | "}
        <button onClick={() => switchTo("alamogordo")} style={{ background:"none",border:0,color: city==="alamogordo" ? "#C09B31" : "#fff",cursor:"pointer" }}>Alamogordo</button>
      </p>
    </footer>
  );
}
