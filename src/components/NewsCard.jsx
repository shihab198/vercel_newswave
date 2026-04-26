import { Link } from 'react-router-dom';
import { timeAgo, getInitials, getPlaceholderImage, truncate, getCategoryColor } from '../utils/helpers';

export default function NewsCard({ news, large = false }) {
  const img = news.image || getPlaceholderImage(news.category);
  const authorName = news.author?.name || 'Staff Reporter';

  return (
    <article className="news-card">
      <Link to={`/news/${news.slug}`} className="news-card-img-wrap">
        <img
          src={img}
          alt={news.title}
          className="news-card-img"
          style={{ height: large ? 260 : 200 }}
          onError={e => { e.target.src = getPlaceholderImage(news.category); }}
        />
        <span className="badge badge-accent" style={{ position: 'absolute', top: 12, left: 12, background: getCategoryColor(news.category) }}>
          {news.category}
        </span>
      </Link>

      <div className="news-card-body">
        <Link to={`/news/${news.slug}`}>
          <h3 className="news-card-title" style={{ fontSize: large ? 22 : 18 }}>
            {news.title}
          </h3>
        </Link>

        <p className="news-card-excerpt">
          {truncate(news.excerpt || news.content, 130)}
        </p>

        <div className="news-card-meta">
          <div className="news-card-author">
            {news.author?.avatar ? (
              <img src={news.author.avatar} alt={authorName} className="avatar" />
            ) : (
              <div className="avatar" style={{ background: '#0d0d0d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, borderRadius: '50%' }}>
                {getInitials(authorName)}
              </div>
            )}
            <span style={{ fontWeight: 500 }}>{authorName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>👁 {news.views || 0}</span>
            <span>{timeAgo(news.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}