// src/pages/_app.js
import "../styles/globals.scss";
import AgeGate from "../components/AgeGate"; // <-- relative path

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AgeGate />
      <Component {...pageProps} />
    </>
  );
}
