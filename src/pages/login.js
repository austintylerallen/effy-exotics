import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function getCityBase(pathname) {
  if (pathname?.startsWith("/las-cruces")) return "/las-cruces";
  if (pathname?.startsWith("/alamogordo")) return "/alamogordo";
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)ee_city=(las-cruces|alamogordo)/);
    if (m) return `/${m[1]}`;
  }
  // default to Las Cruces if nothing is set
  return "/las-cruces";
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, emailSignIn, emailSignUp, startPhoneSignIn, verifyPhoneCode } = useAuth();

  // UI state
  const [tab, setTab] = useState("email"); // 'email' | 'phone'
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone fields
  const [phone, setPhone] = useState("");  // e.g. +15755551212
  const [code, setCode] = useState("");
  const [codeStep, setCodeStep] = useState(false);

  const base = getCityBase(router.pathname);

  // If already logged in, bounce to Account
  useEffect(() => {
    if (!loading && user) {
      router.replace(`${base}/account`);
    }
  }, [user, loading, base, router]);

  async function handleEmail(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await emailSignIn(email, password);
      } else {
        await emailSignUp(email, password);
      }
      router.replace(`${base}/account`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handlePhoneStart(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Ensure phone is E.164, e.g. +15756524619
      await startPhoneSignIn(phone);
      setCodeStep(true);
    } catch (err) {
      setError(err.message || "Failed to start phone sign-in");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyPhoneCode(code);
      router.replace(`${base}/account`);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main style={{minHeight:"70vh", width:"90%", maxWidth:560, margin:"40px auto"}}>
        <h1 style={{textTransform:"uppercase", letterSpacing:2}}>Login</h1>

        {/* Tabs */}
        <div style={{display:"flex", gap:16, margin:"16px 0 24px"}}>
          <button
            onClick={() => setTab("email")}
            style={{border:"1px solid #C09B31", background: tab==="email" ? "#C09B31" : "transparent", color:"#fff", padding:"8px 12px"}}
          >
            Email
          </button>
          <button
            onClick={() => setTab("phone")}
            style={{border:"1px solid #C09B31", background: tab==="phone" ? "#C09B31" : "transparent", color:"#fff", padding:"8px 12px"}}
          >
            Phone
          </button>
        </div>

        {tab === "email" ? (
          <>
            {/* Sign in / up toggle */}
            <div style={{marginBottom:16}}>
              <label style={{marginRight:12}}>
                <input
                  type="radio"
                  checked={mode === "signin"}
                  onChange={() => setMode("signin")}
                />{" "}
                Sign in
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === "signup"}
                  onChange={() => setMode("signup")}
                />{" "}
                Create account
              </label>
            </div>

            <form onSubmit={handleEmail}>
              <div style={{display:"grid", gap:12}}>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
                />
                <button
                  disabled={busy}
                  type="submit"
                  style={{padding:"12px 16px", border:"1px solid #C09B31", background:"#C09B31", color:"#000", cursor:"pointer"}}
                >
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {!codeStep ? (
              <form onSubmit={handlePhoneStart}>
                <div style={{display:"grid", gap:12}}>
                  <input
                    type="tel"
                    required
                    placeholder="+15756524619"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
                  />
                  <button
                    disabled={busy}
                    type="submit"
                    style={{padding:"12px 16px", border:"1px solid #C09B31", background:"#C09B31", color:"#000", cursor:"pointer"}}
                  >
                    {busy ? "Sending code…" : "Send code"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                <div style={{display:"grid", gap:12}}>
                  <input
                    type="text"
                    required
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
                  />
                  <button
                    disabled={busy}
                    type="submit"
                    style={{padding:"12px 16px", border:"1px solid #C09B31", background:"#C09B31", color:"#000", cursor:"pointer"}}
                  >
                    {busy ? "Verifying…" : "Verify code"}
                  </button>
                </div>
              </form>
            )}
            {/* Required container for invisible reCAPTCHA */}
            <div id="recaptcha-container" />
          </>
        )}

        {error && <p style={{color:"#ff6b6b", marginTop:16}}>{error}</p>}
      </main>
      <Footer />
    </>
  );
}
