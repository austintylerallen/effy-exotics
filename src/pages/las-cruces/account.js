import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function AccountLC() {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <>
      <Header />
      <main style={{minHeight:"60vh", width:"90%", maxWidth:720, margin:"40px auto"}}>
        <h1 style={{textTransform:"uppercase", letterSpacing:2}}>My Account</h1>
        {user ? (
          <div style={{marginTop:16}}>
            <p style={{opacity:.85}}>
              Signed in as <strong>{user.email || user.phoneNumber || "Anonymous"}</strong>
            </p>
            <button
              onClick={async () => { await signOutUser(); router.push("/login"); }}
              style={{marginTop:16, padding:"10px 16px", border:"1px solid #C09B31", background:"transparent", color:"#fff", cursor:"pointer"}}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
