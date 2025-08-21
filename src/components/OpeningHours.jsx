// File: src/components/OpeningHours.jsx
import { useEffect, useState } from "react";
import styles from "./opening-hours.module.css";

/* ---------- time helpers ---------- */
function minutesSinceWeekStart(d = new Date()) {
  const day = d.getDay(); // 0=Sun..6=Sat
  const mins = d.getHours() * 60 + d.getMinutes();
  return day * 1440 + mins;
}
function hhmmToMinutes(hhmm) {
  const h = parseInt(hhmm.slice(0, 2), 10);
  const m = parseInt(hhmm.slice(2), 10);
  return h * 60 + m;
}
function formatTime(hhmm) {
  let h = parseInt(hhmm.slice(0, 2), 10);
  const m = hhmm.slice(2);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
}

/* Compute status from Google-style periods */
function computeStatus(periods = []) {
  const WEEK = 7 * 24 * 60; // 10080
  const now = minutesSinceWeekStart();

  const intervals = [];
  for (const p of periods) {
    if (!p.open || !p.close) continue;
    const start = p.open.day * 1440 + hhmmToMinutes(p.open.time);
    const end   = p.close.day * 1440 + hhmmToMinutes(p.close.time);
    intervals.push([start, end], [start + WEEK, end + WEEK]);
  }

  for (const [start, end] of intervals) {
    if (now >= start && now < end) {
      const endNorm = end % WEEK;
      const match = periods.find(
        (p) =>
          p.open && p.close &&
          (p.open.day * 1440 + hhmmToMinutes(p.open.time)) === (start % WEEK) &&
          (p.close.day * 1440 + hhmmToMinutes(p.close.time)) === endNorm
      );
      const closeStr = match?.close?.time;
      return { isOpen: true, changeLabel: closeStr ? `until ${formatTime(closeStr)}` : "" };
    }
  }

  const nextStarts = intervals.map(([s]) => s).filter((s) => s > now).sort((a, b) => a - b);
  if (nextStarts.length) {
    const nextStart = nextStarts[0] % WEEK;
    const match = periods.find(
      (p) => p.open && (p.open.day * 1440 + hhmmToMinutes(p.open.time)) === nextStart
    );
    const openStr = match?.open?.time;
    return { isOpen: false, changeLabel: openStr ? `opens ${formatTime(openStr)}` : "" };
  }
  return { isOpen: false, changeLabel: "" };
}

/**
 * Props:
 * - placeId?: string
 * - fallback?: { weekday_text: string[], periods: Array<{open:{day,time}, close:{day,time}}> }
 */
export default function OpeningHours({ placeId, fallback }) {
  const [hours, setHours] = useState(null);
  const [loading, setLoading] = useState(Boolean(placeId));
  const [err, setErr] = useState(null);

  async function loadHours() {
    try {
      const res = await fetch(`/api/hours?placeId=${placeId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const oh = json?.result?.opening_hours ?? json?.opening_hours ?? null;
      if (!oh) throw new Error("No opening_hours in response");
      setHours(oh);
      setErr(null);
    } catch (e) {
      console.error("OpeningHours fetch error:", e);
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!placeId) {
      if (fallback) setHours(fallback);
      return;
    }
    loadHours();
    const id = setInterval(loadHours, 5 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  if (loading) return <p className={styles.muted}>Loading hours…</p>;
  if (!hours && !fallback) return <p className={styles.muted}>Hours coming soon.</p>;
  if (err && !hours) return <p className={styles.muted}>Unable to load hours.</p>;

  const derived = computeStatus((hours?.periods) || []);
  const isOpen = typeof hours?.open_now === "boolean" ? hours.open_now : derived.isOpen;
  const sub = derived.changeLabel;

  return (
    <div className={styles.wrap} aria-live="polite">
      <div className={styles.statusRow}>
        <span className={`${styles.pill} ${isOpen ? styles.open : styles.closed}`}>
          {isOpen ? "Open now" : "Closed now"}
        </span>
        {sub ? <span className={styles.subtle}> {sub}</span> : null}
      </div>

      <ul className={styles.list}>
        {(hours?.weekday_text || []).map((line, i) => (
          <li key={i} className={styles.item}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
