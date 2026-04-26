import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useNewsStore from '../store/newsStore';
import NewsCard from '../components/NewsCard';
import { CATEGORIES } from '../utils/helpers';

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { news, pagination, loading, fetchNews } = useNewsStore();

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews({ category, search, page });
  }, [category, search, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="section-title">All News</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            {pagination ? `${pagination.count} stories published` : 'Discover the latest stories'}
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search news..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
            {search && (
              <button type="button" className="btn btn-light" onClick={() => { setSearch(''); setSearchInput(''); }}>
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Category filter */}
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn${category === cat ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        {search && (
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            Showing results for "{search}" {pagination && `(${pagination.count} found)`}
          </div>
        )}

        {/* News grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : news.length > 0 ? (
          <>
            <div className="news-grid">
              {news.map(n => (
                <NewsCard key={n._id} news={n} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >←</button>

                {Array.from({ length: pagination.total }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.total || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--muted)', padding: '0 4px' }}>…</span>}
                      <button
                        className={`page-btn${page === p ? ' active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    </span>
                  ))
                }

                <button
                  className="page-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === pagination.total}
                >→</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📰</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8, color: 'var(--ink)' }}>
              No News Found
            </h3>
            <p>
              {search ? `No results for "${search}"` : 'No news in this category yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}