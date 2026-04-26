import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getInitials } from '../utils/helpers';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/news?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <span>📰 Your trusted source for breaking news</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      <div className="container">
        <div className="header-main">
          <Link to="/" className="logo">News<span>Wave</span></Link>

          <nav className={`nav${menuOpen ? ' open' : ''}`}>
            <NavLink to="/" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/news" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>News</NavLink>
            <NavLink to="/contact" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</NavLink>
            {user && (
              <NavLink to="/dashboard" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            )}
          </nav>

          <div className="header-actions">
            <form onSubmit={handleSearch} className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar" style={{ width: 36, height: 36 }} />
                  ) : (
                    <div className="avatar" style={{ width: 36, height: 36, background: '#c9410a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 13, borderRadius: '50%' }}>
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
              <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}