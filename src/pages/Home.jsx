import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNewsStore from '../store/newsStore';
import NewsCard from '../components/NewsCard';
import { timeAgo, getInitials, getPlaceholderImage, getCategoryColor, truncate, CATEGORIES } from '../utils/helpers';

const CATEGORY_ICONS = {
  Technology: '💻', Politics: '🏛️', Sports: '⚽', Business: '💼',
  Health: '❤️', Entertainment: '🎬', Science: '🔬', World: '🌍', Other: '📰'
};

export default function Home() {
  const { topNews, news, fetchTopNews, fetchNews, loading } = useNewsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopNews();
    fetchNews({ page: 1 });
  }, []);

  const heroNews = topNews[0];
  const sideNews = topNews.slice(1, 5);
  const breakingHeadlines = topNews.map(n => n.title).filter(Boolean);

  return (
    <div>
      {/* Breaking News Ticker */}
      {breakingHeadlines.length > 0 && (
        <div className="ticker">
          <div className="container">
            <div className="ticker-inner">
              <span className="ticker-label">🔴 Breaking</span>
              <div className="ticker-scroll">
                <div className="ticker-track">
                  {[...breakingHeadlines, ...breakingHeadlines].map((h, i) => (
                    <span key={i} className="ticker-item">
                      <span className="ticker-dot"></span> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          {loading && !heroNews ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : heroNews ? (
            <div className="hero-grid">
              {/* Main featured story */}
              <div className="hero-main-news" onClick={() => navigate(`/news/${heroNews.slug}`)} style={{ cursor: 'pointer' }}>
                <img
                  src={heroNews.image || getPlaceholderImage(heroNews.category)}
                  alt={heroNews.title}
                  className="hero-main-image"
                  onError={e => { e.target.src = getPlaceholderImage(heroNews.category); }}
                />
                <div className="hero-main-content">
                  <span className="badge badge-accent" style={{ background: getCategoryColor(heroNews.category), marginBottom: 12, display: 'inline-block' }}>
                    {heroNews.category}
                  </span>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
                    {heroNews.title}
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 16 }}>
                    {truncate(heroNews.excerpt || heroNews.content, 120)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    <span>By {heroNews.author?.name}</span>
                    <span>•</span>
                    <span>{timeAgo(heroNews.createdAt)}</span>
                    <span>•</span>
                    <span>👁 {heroNews.views}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar top news */}
              <div className="hero-sidebar">
                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Top Stories</h3>
                {sideNews.map(n => (
                  <div key={n._id} className="hero-side-card" onClick={() => navigate(`/news/${n.slug}`)}>
                    <img
                      src={n.image || getPlaceholderImage(n.category)}
                      alt={n.title}
                      className="hero-side-img"
                      onError={e => { e.target.src = getPlaceholderImage(n.category); }}
                    />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: getCategoryColor(n.category), textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {n.category}
                      </span>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3, marginTop: 4 }}>
                        {truncate(n.title, 70)}
                      </p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '60px 0' }}>
              <p style={{ fontSize: 18 }}>No news available yet. Be the first to publish!</p>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: 20, display: 'inline-flex' }}>
                Get Started →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Strip */}
      <section className="featured-strip">
        <div className="container">
          <div className="featured-strip-grid">
            {Object.entries(CATEGORY_ICONS).slice(0, 8).map(([cat, icon]) => (
              <Link to={`/news?category=${cat}`} key={cat} className="featured-strip-item">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'white' }}>{cat}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News</h2>
            <Link to="/news" className="btn btn-primary">View All →</Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : news.length > 0 ? (
            <div className="news-grid">
              {news.slice(0, 6).map(n => (
                <NewsCard key={n._id} news={n} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>📭</p>
              <p>No news published yet.</p>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ background: 'var(--ink)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Have a Story to Share?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Join thousands of journalists and contributors. Register and start publishing your news today.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Account →</Link>
            <Link to="/news" className="btn btn-outline btn-lg">Browse News</Link>
          </div>
        </div>
      </section>

      {/* Recent from All Categories */}
      {news.length > 6 && (
        <section className="section">
          <div className="container">
            <div className="section-divider">
              <h2>More Stories</h2>
              <div className="divider-line"></div>
            </div>
            <div className="news-grid">
              {news.slice(6, 9).map(n => (
                <NewsCard key={n._id} news={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}