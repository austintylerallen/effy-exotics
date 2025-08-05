// File: src/components/OpeningHours.jsx
import { useState, useEffect } from "react";

export default function OpeningHours({ placeId }) {
  const [hoursData, setHoursData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function loadHours() {
      try {
        const res = await fetch(`/api/hours?placeId=${placeId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setHoursData(json.opening_hours);
      } catch (err) {
        console.error("OpeningHours fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadHours();
  }, [placeId]);

  if (loading) return <p>Loading hours…</p>;
  if (error || !hoursData) return <p>Unable to load hours.</p>;

  const { open_now, weekday_text } = hoursData;

  return (
    <>
      <p style={{ fontWeight: "bold" }}>
        {open_now ? "Open now" : "Closed now"}
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {weekday_text.map((line) => (
          <li key={line} style={{ lineHeight: 1.4 }}>
            {line}
          </li>
        ))}
      </ul>
    </>
  );
}
