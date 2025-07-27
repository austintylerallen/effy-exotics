// src/components/AgeGate.jsx
import { useEffect, useState } from "react";

export default function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Run only in the browser
    if (typeof document === "undefined") return;
    const hasCookie = document.cookie
      .split(";")
      .some(c => c.trim().startsWith("ageVerified=true"));
    if (!hasCookie) setOpen(true);
  }, []);

  if (!open) return null;

  const accept = () => {
    // 30 days
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `ageVerified=true; max-age=${maxAge}; path=/; samesite=lax`;
    setOpen(false);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      id="age-popup"
      className={`popup ${open ? "popup--open" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="popup-content">
        <h2>Age Verification</h2>
        <p>You must be at least 21 years old to enter this site.</p>
        <button onClick={accept}>I am 21 or older</button>
        <button onClick={decline}>I am under 21</button>
      </div>
    </div>
  );
  
}
