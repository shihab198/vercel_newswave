import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ color: 'white', fontSize: 28 }}>
              News<span style={{ color: '#c9410a' }}>Wave</span>
            </div>
            <p className="footer-brand-desc">
              Stay informed with the latest breaking news, in-depth reports, and expert analysis from around the world. Your trusted news partner since 2024.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['𝕏', 'f', 'in', '▶'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontSize: 14,
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => e.target.style.background = '#c9410a'}
                  onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Categories</h4>
            <div className="footer-links">
              {['Technology', 'Politics', 'Sports', 'Business', 'Health', 'Entertainment'].map(cat => (
                <Link key={cat} to={`/news?category=${cat}`} className="footer-link">{cat}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/news" className="footer-link">All News</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/login" className="footer-link">Login</Link>
              <Link to="/register" className="footer-link">Register</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '📧', text: 'news@newswave.com' },
                { icon: '📞', text: '+880 1234567890' },
                { icon: '📍', text: '123 Ave, Dhaka' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NewsWave. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}