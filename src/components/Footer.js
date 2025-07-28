// src/components/Footer.js
export default function Footer() {
    const base =
      typeof document !== "undefined" &&
      document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/)
        ? `/${document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/)[1]}`
        : "/";
  
    return (
      <footer>
        <a href={base} className="link-n-logo" style={{ display: "block" }}>
          <img src="/img/effy-dispensary.svg" alt="Effy Logo" style={{ margin: "auto" }} />
        </a>
        <p className="copyright">©2024 EFFY EXOTICS.<br />All rights reserved.</p>
        <p className="trademark">
          The content, design, graphics, and other materials on this website are protected by copyright…
        </p>
      </footer>
    );
  }
  