import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useNewsStore from '../store/newsStore';
import NewsCard from '../components/NewsCard';
import { formatDate, getInitials, getPlaceholderImage, getCategoryColor } from '../utils/helpers';

export default function SingleNews() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentNews, relatedNews, loading, error, fetchSingleNews } = useNewsStore();

  useEffect(() => {
    fetchSingleNews(slug);
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="loading-center" style={{ minHeight: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  if (error || !currentNews) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>News Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{error || 'This article may have been removed.'}</p>
      <Link to="/news" className="btn btn-primary">← Back to News</Link>
    </div>
  );

  const n = currentNews;
  const img = n.image || getPlaceholderImage(n.category);

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
            <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span>›</span>
            <Link to="/news" style={{ color: 'var(--muted)' }}>News</Link>
            <span>›</span>
            <Link to={`/news?category=${n.category}`} style={{ color: getCategoryColor(n.category), fontWeight: 600 }}>
              {n.category}
            </Link>
          </nav>
        </div>
      </div>

      <div className="container">
        <article className="news-detail">
          {/* Category & Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="badge badge-accent" style={{ background: getCategoryColor(n.category) }}>
              {n.category}
            </span>
            {n.tags?.map(tag => (
              <span key={tag} className="badge" style={{ background: 'var(--paper-dark)', color: 'var(--muted)' }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="news-detail-title">{n.title}</h1>

          {/* Meta */}
          <div className="news-detail-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {n.author?.avatar ? (
                <img src={n.author.avatar} alt={n.author.name} className="avatar" style={{ width: 40, height: 40 }} />
              ) : (
                <div className="avatar" style={{ width: 40, height: 40, background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, borderRadius: '50%' }}>
                  {getInitials(n.author?.name)}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>{n.author?.name}</div>
                {n.author?.bio && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{n.author.bio}</div>}
              </div>
            </div>
            <span>📅 {formatDate(n.createdAt)}</span>
            <span>👁 {n.views} views</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied!');
                }}
                className="btn btn-light btn-sm"
              >
                🔗 Share
              </button>
            </div>
          </div>

          {/* Image */}
          <img
            src={img}
            alt={n.title}
            className="news-detail-img"
            onError={e => { e.target.src = getPlaceholderImage(n.category); }}
          />

          {/* Content */}
          <div className="news-detail-content">
            {n.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Author bio card */}
          {n.author && (
            <div style={{ background: 'var(--white)', borderRadius: 8, padding: 24, marginTop: 48, display: 'flex', gap: 20, alignItems: 'center', boxShadow: 'var(--shadow)' }}>
              {n.author.avatar ? (
                <img src={n.author.avatar} alt={n.author.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                  {getInitials(n.author.name)}
                </div>
              )}
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>About {n.author.name}</div>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{n.author.bio || 'Contributor at NewsWave'}</p>
              </div>
            </div>
          )}
        </article>

        {/* Related news */}
        {relatedNews.length > 0 && (
          <div style={{ paddingBottom: 80 }}>
            <div className="section-divider" style={{ marginBottom: 24 }}>
              <h2>Related Stories</h2>
              <div className="divider-line"></div>
            </div>
            <div className="news-grid">
              {relatedNews.map(r => (
                <NewsCard key={r._id} news={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}