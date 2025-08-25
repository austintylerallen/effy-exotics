// File: src/pages/api/hours.js
export default async function handler(req, res) {
  try {
    // 0) Only allow GET
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { placeId } = req.query;
    const key = process.env.GOOGLE_MAPS_API_KEY;

    // 1) Guard: have key?
    if (!key) {
      console.error("[/api/hours] missing GOOGLE_MAPS_API_KEY");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: missing GOOGLE_MAPS_API_KEY" });
    }

    // 2) Guard: have placeId?
    if (!placeId) {
      console.error("[/api/hours] missing placeId");
      return res.status(400).json({ error: "Missing placeId parameter" });
    }

    // 3) Call Places Details for both current & classic hours
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set(
      "fields",
      "current_opening_hours,opening_hours,business_status,utc_offset_minutes"
    );
    url.searchParams.set("key", key);

    const r = await fetch(url.toString(), { cache: "no-store" });

    // HTTP-level failure from Google
    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({
        error: "Upstream HTTP error from Google",
        http_status: r.status,
        body: text.slice(0, 500),
      });
    }

    const data = await r.json();

    // Places-level failure (REQUEST_DENIED, INVALID_REQUEST, etc.)
    if (data.status !== "OK") {
      return res.status(502).json({
        error: "Google Places error",
        status: data.status,
        message: data.error_message || null,
      });
    }

    const result = data.result || {};
    const current = result.current_opening_hours || {};
    const base = result.opening_hours || {};

    // 4) Return a flat, UI-friendly payload
    const payload = {
      weekday_text: current.weekday_text || base.weekday_text || null,
      periods: current.periods || base.periods || null,
      open_now:
        typeof current.open_now === "boolean"
          ? current.open_now
          : typeof base.open_now === "boolean"
          ? base.open_now
          : null,
      business_status: result.business_status || null,
      utc_offset_minutes: result.utc_offset_minutes ?? null,
    };

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(payload);
  } catch (e) {
    console.error("[/api/hours] unhandled exception:", e);
    return res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}
