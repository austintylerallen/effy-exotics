import { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebaseClient";
import { track } from "../lib/track";
import styles from "./SubscribeForm.module.css";

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
      const email = value.trim().toLowerCase();
      await save({ email });
      track("newsletter_submit", { location: city || "", type: "email" });
      setDone(true);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally { setBusy(false); }
  }
  
  async function submitPhone(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const digits = value.trim().replace(/\D/g, "");
      if (digits.length < 10) throw new Error("Please enter a 10-digit phone number");
      const phoneWithCountry = `+1${digits}`;
      await save({ phone: phoneWithCountry });
      track("newsletter_submit", { location: city || "", type: "sms" });
      setDone(true);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally { setBusy(false); }
  }

  return (
    <section className={styles.subscribe} aria-labelledby="sub-title">
      <div className={styles.inner}>
        <h3 id="sub-title" className={styles.title}>Stay in the loop</h3>

        {done ? (
          <p className={styles.thanks}>
            <span className={styles.check} aria-hidden="true">✓</span>
            Thanks! You’re on the list.
          </p>
        ) : (
          <>
            {/* tabs */}
            <div className={styles.tabs} role="tablist" aria-label="Sign-up options">
              <button
                role="tab"
                aria-selected={tab === "email"}
                className={`${styles.tab} ${tab === "email" ? styles.isActive : ""}`}
                onClick={() => { setTab("email"); setError(""); setValue(""); }}
              >
                Email
              </button>
              <button
                role="tab"
                aria-selected={tab === "phone"}
                className={`${styles.tab} ${tab === "phone" ? styles.isActive : ""}`}
                onClick={() => { setTab("phone"); setError(""); setValue(""); }}
              >
                SMS
              </button>
            </div>

            {/* email form */}
            {tab === "email" && (
              <form onSubmit={submitEmail} className={styles.form} noValidate>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="Email address"
                  />
                </div>
                <button className={`${styles.btn} ${styles.primary}`} disabled={busy}>
                  {busy ? "Adding…" : "Join"}
                </button>
              </form>
            )}

            {/* phone form */}
            {tab === "phone" && (
              <form onSubmit={submitPhone} className={styles.form} noValidate>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="tel"
                    required
                    placeholder="575-555-1212"
                    autoComplete="tel"
                    inputMode="tel"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="Mobile phone number"
                  />
                </div>
                <button className={`${styles.btn} ${styles.secondary}`} disabled={busy}>
                  {busy ? "Adding…" : "Text Me"}
                </button>
              </form>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.disclaimer}>
              By subscribing, you agree to receive updates from Effy Exotics. Msg &amp; data rates may apply. Reply STOP to unsubscribe.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
