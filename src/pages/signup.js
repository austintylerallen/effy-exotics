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
  // default if nothing set yet
  return "/las-cruces";
}

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading, emailSignUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const base = getCityBase(router.pathname);

  // If logged in already, send to account
  useEffect(() => {
    if (!loading && user) router.replace(`${base}/account`);
  }, [user, loading, base, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      await emailSignUp(email, password);
      router.replace(`${base}/account`);
    } catch (err) {
      setError(err?.message || "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: "70vh", width: "90%", maxWidth: 560, margin: "40px auto" }}>
        <h1 style={{ textTransform: "uppercase", letterSpacing: 2 }}>Create Account</h1>
        <p style={{ opacity: 0.85, margin: "8px 0 24px" }}>
          Sign up with email and password. (Phone login is available on the Login page.)
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", border: "1px solid #444", background: "#111", color: "#fff" }}
          />
          <input
            type="password"
            required
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", border: "1px solid #444", background: "#111", color: "#fff" }}
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ padding: "10px", border: "1px solid #444", background: "#111", color: "#fff" }}
          />
          <button
            disabled={busy}
            type="submit"
            style={{ padding: "12px 16px", border: "1px solid #C09B31", background: "#C09B31", color: "#000", cursor: "pointer" }}
          >
            {busy ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        {error && <p style={{ color: "#ff6b6b", marginTop: 16 }}>{error}</p>}

        <p style={{ marginTop: 24 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#C09B31", textDecoration: "none" }}>Log in</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
