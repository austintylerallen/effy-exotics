import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <h1>Page not found</h1>
        <p>
          Try our <Link href="/las-cruces">Las Cruces</Link> homepage.
        </p>
      </div>
    </main>
  );
}
