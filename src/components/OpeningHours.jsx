// File: src/components/OpeningHours.jsx
import { useEffect, useMemo, useRef, useState } from "react";
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

/** Prefer current_opening_hours when available; otherwise opening_hours; also handle flat shape. */
function normalizeHours(json) {
  const r = json?.result ?? json;

  // Preferred (newer) shape
  const cur = r?.current_opening_hours;
  if (cur?.weekday_text?.length || cur?.periods?.length) {
    return {
      weekday_text: cur.weekday_text ?? [],
      periods: cur.periods ?? [],
      open_now: typeof cur.open_now === "boolean" ? cur.open_now : undefined,
    };
  }

  // Classic opening_hours
  const base = r?.opening_hours;
  if (base?.weekday_text?.length || base?.periods?.length) {
    return {
      weekday_text: base.weekday_text ?? [],
      periods: base.periods ?? [],
      open_now: typeof base.open_now === "boolean" ? base.open_now : undefined,
    };
  }

  // Some backends return hours directly at top level
  if (r?.weekday_text?.length || r?.periods?.length) {
    return {
      weekday_text: r.weekday_text ?? [],
      periods: r.periods ?? [],
      open_now: typeof r.open_now === "boolean" ? r.open_now : undefined,
    };
  }

  return null;
}

/* Compute status from Google-style periods */
function computeStatus(periods = []) {
  const WEEK = 7 * 24 * 60; // 10080
  const now = minutesSinceWeekStart();

  const intervals = [];
  for (const p of periods) {
    if (!p.open || !p.close) continue;
    const start = p.open.day * 1440 + hhmmToMinutes(p.open.time);
    const end = p.close.day * 1440 + hhmmToMinutes(p.close.time);
    // handle week wrap by duplicating into next week
    intervals.push([start, end], [start + WEEK, end + WEEK]);
  }

  for (const [start, end] of intervals) {
    if (now >= start && now < end) {
      const endNorm = end % WEEK;
      const match = periods.find(
        (p) =>
          p.open &&
          p.close &&
          p.open.day * 1440 + hhmmToMinutes(p.open.time) === (start % WEEK) &&
          p.close.day * 1440 + hhmmToMinutes(p.close.time) === endNorm
      );
      const closeStr = match?.close?.time;
      return {
        isOpen: true,
        changeLabel: closeStr ? `until ${formatTime(closeStr)}` : "",
      };
    }
  }

  const nextStarts = intervals
    .map(([s]) => s)
    .filter((s) => s > now)
    .sort((a, b) => a - b);

  if (nextStarts.length) {
    const nextStart = nextStarts[0] % WEEK;
    const match = periods.find(
      (p) => p.open && p.open.day * 1440 + hhmmToMinutes(p.open.time) === nextStart
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
 * - refreshMs?: number (default 5 minutes)
 * - apiPath?: string (default "/api/hours")
 * - debug?: boolean (logs error payloads in console)
 */
export default function OpeningHours({
  placeId,
  fallback,
  refreshMs = 5 * 60 * 1000,
  apiPath = "/api/hours",
  debug = false,
}) {
  const [hours, setHours] = useState(null);
  const [loading, setLoading] = useState(Boolean(placeId));
  const [err, setErr] = useState(null);

  // keep latest placeId and abort controller across refreshes
  const placeIdRef = useRef(placeId);
  const abortRef = useRef(null);
  placeIdRef.current = placeId;

  const haveFallback = useMemo(
    () => Boolean(fallback?.weekday_text?.length || fallback?.periods?.length),
    [fallback]
  );

  async function loadHoursActive(pid) {
    if (!pid) return;

    // cancel any in-flight request
    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;

    try {
      setLoading(true);
      setErr(null);

      const url = `${apiPath}?placeId=${encodeURIComponent(pid)}`;
      const res = await fetch(url, { cache: "no-store", signal: ctl.signal });

      let json;
      try {
        json = await res.clone().json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        // Do not throw—record error, keep any existing hours, and fallback if needed.
        const message =
          json?.error ||
          json?.message ||
          `HTTP ${res.status}${json?.status ? ` (${json.status})` : ""}`;
        if (debug) {
          console.error("OpeningHours API error:", { status: res.status, json });
        }
        setErr(new Error(message));
        setHours((prev) => prev ?? (haveFallback ? fallback : null));
        return;
      }

      const normalized = normalizeHours(json);
      if (!normalized) {
        if (debug) console.error("OpeningHours: no opening hours in response", json);
        setErr(new Error("No opening hours in response"));
        setHours((prev) => prev ?? (haveFallback ? fallback : null));
        return;
      }

      setHours(normalized);
      setErr(null);
    } catch (e) {
      if (e.name === "AbortError") return;
      if (debug) console.error("OpeningHours fetch error:", e);
      setErr(e);
      // Keep any existing hours; else use fallback
      setHours((prev) => prev ?? (haveFallback ? fallback : null));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial resolve: if no placeId, use fallback immediately
    if (!placeId) {
      setHours(haveFallback ? fallback : null);
      setLoading(false);
      setErr(null);
      return;
    }

    loadHoursActive(placeId);

    // periodic refresh
    const timer = setInterval(() => {
      if (placeIdRef.current) loadHoursActive(placeIdRef.current);
    }, Math.max(30_000, refreshMs)); // minimum 30s to avoid hammering

    return () => {
      clearInterval(timer);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, apiPath, haveFallback]);

  if (loading && !hours) return <p className={styles.muted}>Loading hours…</p>;

  // Prefer actual hours; otherwise fallback; otherwise show "coming soon"
  const effective = hours ?? (haveFallback ? fallback : null);
  if (!effective) {
    return <p className={styles.muted}>Hours coming soon.</p>;
  }

  const derived = computeStatus(effective.periods || []);
  const isOpen =
    typeof effective.open_now === "boolean" ? effective.open_now : derived.isOpen;
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
        {(effective.weekday_text || []).map((line, i) => (
          <li key={i} className={styles.item}>
            {line}
          </li>
        ))}
      </ul>

      {err && (
        <p className={styles.muted} style={{ marginTop: 8 }}>
          <small>Some hours may be temporarily unavailable.</small>
        </p>
      )}
    </div>
  );
}
