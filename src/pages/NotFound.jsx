import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 900, color: 'var(--paper-dark)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginTop: 8, marginBottom: 16 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
          <Link to="/news" className="btn btn-light btn-lg">Browse News</Link>
        </div>
      </div>
    </div>
  );
}