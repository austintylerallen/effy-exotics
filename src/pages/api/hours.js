// File: src/pages/api/hours.js
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Accept either ?placeId= or ?place_id=
    const placeId = (req.query.placeId || req.query.place_id || "").toString().trim();
    const key = process.env.GOOGLE_MAPS_API_KEY;

    if (!key) {
      console.error("[/api/hours] missing GOOGLE_MAPS_API_KEY");
      return res.status(500).json({
        error: "Server misconfiguration: missing GOOGLE_MAPS_API_KEY",
      });
    }

    if (!placeId) {
      console.error("[/api/hours] missing placeId");
      return res.status(400).json({ error: "Missing placeId parameter" });
    }

    // Keep fields to those well-supported by the Place Details JSON endpoint
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set(
      "fields",
      // Removed utc_offset_minutes to avoid INVALID_REQUEST on some accounts
      "current_opening_hours,opening_hours,business_status"
    );
    // Optional locale hints (safe to omit)
    if (req.headers["accept-language"]) {
      url.searchParams.set("language", req.headers["accept-language"]);
    }
    url.searchParams.set("key", key);

    const resp = await fetch(url.toString(), { cache: "no-store" });

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return res.status(502).json({
        error: "Upstream HTTP error from Google",
        http_status: resp.status,
        body: body.slice(0, 500),
      });
    }

    const data = await resp.json();

    if (data.status && data.status !== "OK") {
      // INVALID_REQUEST is the common 400 you just saw
      const statusMap = {
        INVALID_REQUEST: 400,
        NOT_FOUND: 404,
        REQUEST_DENIED: 403,
        OVER_QUERY_LIMIT: 429,
        ZERO_RESULTS: 404,
      };
      const code = statusMap[data.status] || 502;
      return res.status(code).json({
        error: "Google Places error",
        status: data.status,
        message: data.error_message || null,
      });
    }

    const result = data.result || {};
    const current = result.current_opening_hours || {};
    const base = result.opening_hours || {};

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
      // utc_offset_minutes omitted on purpose; not needed for UI
    };

    res.setHeader("Cache-Control", "no-store, max-age=0, s-maxage=0");
    return res.status(200).json(payload);
  } catch (e) {
    console.error("[/api/hours] unhandled exception:", e);
    return res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}
