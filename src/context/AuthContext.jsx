// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getWebAuth } from "../lib/firebaseClient";

const AuthContext = createContext({ user: null, loading: true });
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  const confirmationRef = useRef(null);
  const recaptchaRef    = useRef(null);

  useEffect(() => {
    let unsub;
    (async () => {
      try {
        const a = await getWebAuth(); // null on server
        setAuth(a);
        if (a) {
          const { onAuthStateChanged } = await import("firebase/auth");
          unsub = onAuthStateChanged(a, (u) => {
            setUser(u || null);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth init failed", e);
        setLoading(false);
      }
    })();
    return () => { if (typeof unsub === "function") unsub(); };
  }, []);

  // Helper to ensure auth is ready
  const requireAuth = () => {
    if (!auth) throw new Error("Auth not ready yet");
    return auth;
    };

  // Email/password
  const emailSignIn = async (email, password) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(requireAuth(), email, password);
  };
  const emailSignUp = async (email, password) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    return createUserWithEmailAndPassword(requireAuth(), email, password);
  };

  // Google
  const googleSignIn = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(requireAuth(), provider);
  };

  const signOutUser = async () => {
    const { signOut } = await import("firebase/auth");
    return signOut(requireAuth());
  };

  // Phone auth
  async function ensureRecaptcha() {
    const a = requireAuth();
    if (recaptchaRef.current) return recaptchaRef.current;
    const { RecaptchaVerifier } = await import("firebase/auth");
    recaptchaRef.current = new RecaptchaVerifier(a, "recaptcha-container", { size: "invisible" });
    return recaptchaRef.current;
  }

  const startPhoneSignIn = async (phoneE164) => {
    const a = requireAuth();
    const { signInWithPhoneNumber } = await import("firebase/auth");
    const verifier = await ensureRecaptcha();
    confirmationRef.current = await signInWithPhoneNumber(a, phoneE164, verifier);
    return true;
  };

  const verifyPhoneCode = async (code) => {
    if (!confirmationRef.current) throw new Error("No pending phone confirmation.");
    const result = await confirmationRef.current.confirm(code);
    confirmationRef.current = null;
    return result.user;
  };

  const value = {
    user,
    loading,
    emailSignIn,
    emailSignUp,
    googleSignIn,
    signOutUser,
    startPhoneSignIn,
    verifyPhoneCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
