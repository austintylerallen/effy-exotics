// src/components/SubscribeForm.jsx
import { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebaseClient";
import { track } from "../lib/track";

const db = getFirestore(app);

export default function SubscribeForm({ city = null }) {
  /* ui state */
  const [tab, setTab] = useState("email");   // email | phone
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);

  /* helper – persist opt-in */
  async function save(data) {
    await addDoc(collection(db, "subscribers"), {
      city,
      ...data,
      ts: serverTimestamp(),
    });
  }

  /* submit handlers */
  async function submitEmail(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await save({ email: value.trim().toLowerCase() });
      track("newsletter_submit", { location: city || "" });
      setDone(true);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  
  async function submitPhone(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const digits = value.trim().replace(/\D/g, "");
      const phoneWithCountry = `+1${digits}`;
      await save({ phone: phoneWithCountry });
      track("newsletter_submit", { location: city || "" });
      setDone(true);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <section className="subscribe">
      <div className="subscribe__inner">
        <h3 className="subscribe__title">Stay in the loop</h3>

        {done ? (
          <p className="subscribe__thanks">Thanks! You’re on the list.</p>
        ) : (
          <>
            {/* tabs */}
            <div
              className="subscribe__tabs"
              role="tablist"
              aria-label="Sign-up options"
            >
              <button
                role="tab"
                aria-selected={tab === "email"}
                className={`subscribe__tab${tab === "email" ? " is-active" : ""}`}
                onClick={() => { setTab("email"); setError(""); setValue(""); }}
              >
                Email
              </button>
              <button
                role="tab"
                aria-selected={tab === "phone"}
                className={`subscribe__tab${tab === "phone" ? " is-active" : ""}`}
                onClick={() => { setTab("phone"); setError(""); setValue(""); }}
              >
                SMS
              </button>
            </div>

            {/* email form */}
            {tab === "email" && (
              <form onSubmit={submitEmail} className="subscribe__form">
                <input
                  className="subscribe__input"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button className="subscribe__btn" disabled={busy}>
                  {busy ? "Adding…" : "Join"}
                </button>
              </form>
            )}

            {/* phone form */}
            {tab === "phone" && (
              <form onSubmit={submitPhone} className="subscribe__form">
                <input
                  className="subscribe__input"
                  type="tel"
                  required
                  placeholder="575-555-1212"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button className="subscribe__btn" disabled={busy}>
                  {busy ? "Adding…" : "Text Me"}
                </button>
              </form>
            )}

            {error && <p className="subscribe__error">{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}
