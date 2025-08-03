import { useState, useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../lib/firebaseClient";

const auth = getAuth(app);
const db   = getFirestore(app);

/* helper to persist the opt-in */
async function saveSubscriber(uid, data) {
  await setDoc(doc(db, "subscribers", uid), { ...data, ts: Date.now() });
}

export default function SubscribeForm() {
  /* ui state */
  const [tab,   setTab]   = useState("email");   // email | phone
  const [step,  setStep]  = useState("form");    // form  | code | done
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [code,  setCode]  = useState("");

  /* ───────── EMAIL FLOW ───────── */
  async function handleEmail(e) {
    e.preventDefault();
    setError("");  setBusy(true);
    try {
      await sendSignInLinkToEmail(auth, value, {
        url: window.location.href,
        handleCodeInApp: true
      });
      window.localStorage.setItem("ee_sub_email", value);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  /* complete the email link automatically */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    const stored = window.localStorage.getItem("ee_sub_email");
    if (stored) {
      signInWithEmailLink(auth, stored, window.location.href)
        .then(({ user }) => saveSubscriber(user.uid, { email: stored }))
        .catch(console.error);
    }
  }, []);

  /* ───────── PHONE FLOW ───────── */
  async function sendCode(e) {
    e.preventDefault();
    setError("");  setBusy(true);
    try {
      window.recaptchaVerifier =
        window.recaptchaVerifier ||
        new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);

      const confirmation = await signInWithPhoneNumber(
        auth,
        value,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmation;
      setStep("code");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setError("");  setBusy(true);
    try {
      const { user } = await window.confirmationResult.confirm(code);
      await saveSubscriber(user.uid, { phone: value });
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  /* ───────── MARKUP ───────── */
  return (
    <section className="subscribe">
      <div className="subscribe__inner">
        <h3 className="subscribe__title">Stay in the loop</h3>

        {step === "done" ? (
          <p className="subscribe__thanks">Thanks! You’re on the list.</p>
        ) : (
          <>
            {/* tab buttons */}
            <div className="subscribe__tabs" role="tablist" aria-label="Sign-up options">
              <button
                role="tab"
                aria-selected={tab === "email"}
                className={`subscribe__tab${tab === "email" ? " is-active" : ""}`}
                onClick={() => { setTab("email"); setStep("form"); setError(""); }}
              >
                Email
              </button>
              <button
                role="tab"
                aria-selected={tab === "phone"}
                className={`subscribe__tab${tab === "phone" ? " is-active" : ""}`}
                onClick={() => { setTab("phone"); setStep("form"); setError(""); }}
              >
                SMS
              </button>
            </div>

            {/* email form */}
            {tab === "email" && step === "form" && (
              <form onSubmit={handleEmail} className="subscribe__form">
                <input
                  className="subscribe__input"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button className="subscribe__btn" disabled={busy}>
                  {busy ? "Sending…" : "Join"}
                </button>
              </form>
            )}

            {/* phone form */}
            {tab === "phone" && step === "form" && (
              <form onSubmit={sendCode} className="subscribe__form">
                <input
                  className="subscribe__input"
                  type="tel"
                  required
                  placeholder="+1 575-555-1212"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button className="subscribe__btn" disabled={busy}>
                  {busy ? "Sending…" : "Text Me"}
                </button>
                <div id="recaptcha-container" />
              </form>
            )}

            {/* verify code */}
            {step === "code" && (
              <form onSubmit={verifyCode} className="subscribe__form">
                <input
                  className="subscribe__input"
                  type="text"
                  required
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="subscribe__btn" disabled={busy}>
                  {busy ? "Verifying…" : "Confirm"}
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
