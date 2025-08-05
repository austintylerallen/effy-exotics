// File: src/pages/api/hours.js
export default async function handler(req, res) {
    try {
      const { placeId } = req.query;
      const key = process.env.GOOGLE_MAPS_API_KEY;
  
      // 1️⃣ Guard: do we actually have a key?
      if (!key) {
        console.error("[/api/hours] missing GOOGLE_MAPS_API_KEY");
        return res
          .status(500)
          .json({ error: "Server misconfiguration: missing API key" });
      }
  
      // 2️⃣ Guard: did the client pass a placeId?
      if (!placeId) {
        console.error("[/api/hours] missing placeId");
        return res.status(400).json({ error: "Missing placeId parameter" });
      }
  
      // 3️⃣ Build & call the Places Details endpoint
      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/details/json"
      );
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("fields", "opening_hours");
      url.searchParams.set("key", key);
  
      const r = await fetch(url.toString());
      const data = await r.json();
  
      // 4️⃣ If Google tells us “NOT OK” pass that back
      if (data.status !== "OK") {
        console.error("[/api/hours] Google error:", data.status, data.error_message);
        return res
          .status(400)
          .json({ error: data.status, message: data.error_message });
      }
  
      // 5️⃣ All good—send back just the opening_hours block
      return res.status(200).json({ opening_hours: data.result.opening_hours });
    } catch (e) {
      console.error("[/api/hours] unhandled exception:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  