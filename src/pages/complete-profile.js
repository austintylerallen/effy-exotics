// pages/complete-profile.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CompleteProfile() {
  const { user, updateProfileInfo } = useAuth(); // you'll need updateProfileInfo in your context
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateProfileInfo({ name, address }); // custom function you’ll add
      router.push("/account");
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const skip = () => {
    router.push("/account");
  };

  return (
    <>
      <Header />
      <main style={{minHeight:"70vh", width:"90%", maxWidth:560, margin:"40px auto"}}>
        <h1 style={{textTransform:"uppercase", letterSpacing:2}}>Complete Your Profile</h1>

        <form onSubmit={handleSubmit} style={{display: "grid", gap: 12}}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
          />
          <input
            type="text"
            placeholder="Delivery Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{padding:"10px", border:"1px solid #444", background:"#111", color:"#fff"}}
          />

          <button
            type="submit"
            disabled={saving}
            style={{padding:"12px 16px", border:"1px solid #C09B31", background:"#C09B31", color:"#000", cursor:"pointer"}}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>

          <button
            type="button"
            onClick={skip}
            style={{padding:"10px", background:"transparent", border:"none", color:"#C09B31", textDecoration:"underline"}}
          >
            Skip for now
          </button>

          {error && <p style={{color: "#ff6b6b"}}>{error}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
