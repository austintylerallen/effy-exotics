import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getWebAuth } from "../lib/firebaseClient";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { useRouter } from "next/router";

const AuthContext = createContext({ user: null, loading: true });
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);
  const router = useRouter();

  const db = getFirestore(getApp());

  useEffect(() => {
    let unsub;
    (async () => {
      try {
        const a = await getWebAuth();
        setAuth(a);
        if (a) {
          const { onAuthStateChanged } = await import("firebase/auth");
          unsub = onAuthStateChanged(a, async (u) => {
            setUser(u || null);
            setLoading(false);

            if (u) {
                setProfileLoaded(true); // ✅ assume profile is fine for now
              }
              
          });
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth init failed", e);
        setLoading(false);
      }
    })();
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [db, router]);

  const requireAuth = () => {
    if (!auth) throw new Error("Auth not ready yet");
    return auth;
  };

  const emailSignIn = async (email, password) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(requireAuth(), email, password);
  };

  const emailSignUp = async (email, password) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    return createUserWithEmailAndPassword(requireAuth(), email, password);
  };

  const googleSignIn = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(requireAuth(), provider);
  };

  const signOutUser = async () => {
    const { signOut } = await import("firebase/auth");
    return signOut(requireAuth());
  };

  async function ensureRecaptcha() {
    const a = requireAuth();
    if (recaptchaRef.current) return recaptchaRef.current;
    const { RecaptchaVerifier } = await import("firebase/auth");
    recaptchaRef.current = new RecaptchaVerifier(a, "recaptcha-container", {
      size: "invisible",
    });
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

  const updateProfileInfo = async ({ name, address }) => {
    if (!user) throw new Error("No user available");
  
    const profileRef = doc(db, "users", user.uid);
    await setDoc(profileRef, { name, address }, { merge: true });
  
    // ✅ Re-fetch to make sure profileLoaded logic sees the update
    const updatedSnap = await getDoc(profileRef);
    const updatedData = updatedSnap.data();
    const hasName = updatedData?.name?.trim();
    const hasAddress = updatedData?.address?.trim();
  
    if (hasName && hasAddress) {
      setProfileLoaded(true);
    }
  };
  

  const value = {
    user,
    loading: loading || (user && !profileLoaded),
    emailSignIn,
    emailSignUp,
    googleSignIn,
    signOutUser,
    startPhoneSignIn,
    verifyPhoneCode,
    updateProfileInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
