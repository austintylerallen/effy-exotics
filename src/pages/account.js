import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

export default function AccountPage() {
  const { user, loading, signOutUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
useEffect(() => {
  if (user) {
    console.log("🔥 UID:", user.uid);
  }
}, [user]);

  const router = useRouter();
  const db = getFirestore(getApp());

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [user, db]);

  if (loading || profileLoading) return null;

  return (
    <>
      <Header />
      <main style={{ minHeight: "60vh", width: "90%", maxWidth: 720, margin: "40px auto" }}>
        <h1 style={{ textTransform: "uppercase", letterSpacing: 2 }}>My Account</h1>

        {user && (
          <div style={{ marginTop: 16 }}>
            <p style={{ opacity: 0.85 }}>
              Signed in as <strong>{user.email || user.phoneNumber || "Anonymous"}</strong>
            </p>

            {profile ? (
              <>
                <p style={{ marginTop: 8 }}>
                  Name: <strong>{profile.name || "Not set"}</strong>
                </p>
                <p style={{ marginTop: 4 }}>
                  Address: <strong>{profile.address || "Not set"}</strong>
                </p>
              </>
            ) : (
              <p style={{ marginTop: 8, color: "#ff6b6b" }}>No profile found.</p>
            )}

            <button
              onClick={async () => {
                await signOutUser();
                router.push("/login");
              }}
              style={{
                marginTop: 20,
                padding: "10px 16px",
                border: "1px solid #C09B31",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
