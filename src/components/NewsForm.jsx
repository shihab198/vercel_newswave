import { useState, useEffect } from 'react';
import useNewsStore from '../store/newsStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Politics', 'Sports', 'Business', 'Health', 'Entertainment', 'Science', 'World', 'Other'];

export default function NewsForm({ existing, onClose, onSaved }) {
  const { createNews, updateNews } = useNewsStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '',
    image: '', category: 'Technology', tags: ''
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        content: existing.content || '',
        excerpt: existing.excerpt || '',
        image: existing.image || '',
        category: existing.category || 'Technology',
        tags: existing.tags?.join(', ') || '',
      });
    }
  }, [existing]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error('Title and content are required');
    }

    setLoading(true);
    const result = existing
      ? await updateNews(existing._id, form)
      : await createNews(form);
    setLoading(false);

    if (result.success) {
      toast.success(existing ? 'News updated!' : 'News published!');
      onSaved?.();
      onClose();
    } else {
      toast.error(result.message || 'Something went wrong');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{existing ? 'Edit News' : 'Write New Story'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter news headline..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                name="image"
                className="form-input"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea
              name="content"
              className="form-input"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your news article here..."
              style={{ minHeight: 200 }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt (optional)</label>
            <textarea
              name="excerpt"
              className="form-input"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short summary for preview..."
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              value={form.tags}
              onChange={handleChange}
              placeholder="politics, election, 2024"
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving...' : (existing ? '✏️ Update' : '📤 Publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}