// src/components/AgeGate.jsx
import { useEffect, useState } from "react";

export default function AgeGate() {
  const [open, setOpen] = useState(false);

  /* check cookie once on mount */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const verified = document.cookie
      .split(";")
      .some((c) => c.trim() === "ageVerified=true");

    if (!verified) setOpen(true);

    /* optional: freeze scroll while gate is open */
    document.body.style.overflow = verified ? "auto" : "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!open) return null;

  return (
    <div className="age-overlay">
      <div className="age-modal">
        <h2>Age Verification</h2>
        <p>You must be <strong>21&nbsp;or older</strong> to enter this site.</p>

        <div className="age-actions">
          <button
            className="btn-primary"
            onClick={() => {
              document.cookie = `ageVerified=true; max-age=${60 * 60 * 24 * 30}; path=/`;
              setOpen(false);
            }}
          >
            I’m 21&nbsp;+ let me in
          </button>

          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "https://www.google.com")}
          >
            I’m under&nbsp;21
          </button>
        </div>
      </div>
    </div>
  );
}
