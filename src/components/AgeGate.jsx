import { useEffect, useState } from "react";

export default function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim() === "ageVerified=true");
    if (!hasCookie) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div id="age-popup" className="popup" style={{ display: "flex" }}>
      <div className="popup-content">
        <h2>Age Verification</h2>
        <p>You must be at least 21 years old to enter this site.</p>
        <button
          onClick={() => {
            document.cookie = `ageVerified=true; max-age=${60 * 60 * 24 * 30}; path=/`;
            setOpen(false);
          }}
        >
          I am 21 or older
        </button>
        <button onClick={() => (window.location.href = "https://www.google.com")}>
          I am under 21
        </button>
      </div>
    </div>
  );
}
