import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNewsStore from '../store/newsStore';
import NewsForm from '../components/NewsForm';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDate, getInitials, getCategoryColor, truncate } from '../utils/helpers';

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const { myNews, fetchMyNews, deleteNews, loading } = useNewsStore();
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyNews();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setSaving(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news?')) return;
    const result = await deleteNews(id);
    if (result.success) toast.success('News deleted');
    else toast.error(result.message);
  };

  const publishedCount = myNews.filter(n => n.isPublished).length;
  const totalViews = myNews.reduce((s, n) => s + (n.views || 0), 0);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'my-news', label: '📰 My News' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'security', label: '🔒 Security' },
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-grid">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="sidebar-avatar-img" />
              ) : (
                <div className="sidebar-avatar-placeholder">{getInitials(user?.name)}</div>
              )}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user?.email}</div>
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-accent" style={{ background: user?.role === 'admin' ? '#7c3aed' : 'var(--accent)' }}>
                  {user?.role === 'admin' ? '⭐ Admin' : '✍️ Writer'}
                </span>
              </div>
            </div>

            <nav className="sidebar-nav">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`sidebar-nav-item${tab === t.id ? ' active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--paper-dark)' }}>
              <Link to="/news" className="sidebar-nav-item" style={{ display: 'flex' }}>
                🌐 View All News
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main>
            {/* Overview */}
            {tab === 'overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h2>
                  <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Write Story
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-red">📰</div>
                    <div>
                      <div className="stat-number">{myNews.length}</div>
                      <div className="stat-label">Total Articles</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div>
                      <div className="stat-number">{publishedCount}</div>
                      <div className="stat-label">Published</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">👁</div>
                    <div>
                      <div className="stat-number">{totalViews.toLocaleString()}</div>
                      <div className="stat-label">Total Views</div>
                    </div>
                  </div>
                </div>

                {/* Recent articles */}
                <div style={{ background: 'var(--white)', borderRadius: 8, padding: 24, boxShadow: 'var(--shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Recent Articles</h3>
                    <button className="btn btn-light btn-sm" onClick={() => setTab('my-news')}>View All</button>
                  </div>

                  {loading ? (
                    <div className="loading-center" style={{ minHeight: 150 }}><div className="spinner"></div></div>
                  ) : myNews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>✍️</div>
                      <p>You haven't written any articles yet.</p>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>
                        Write your first story
                      </button>
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Views</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myNews.slice(0, 5).map(n => (
                            <tr key={n._id}>
                              <td>
                                <Link to={`/news/${n.slug}`} style={{ fontWeight: 500, color: 'var(--ink)' }}>
                                  {truncate(n.title, 55)}
                                </Link>
                              </td>
                              <td>
                                <span className="badge" style={{ background: getCategoryColor(n.category) + '20', color: getCategoryColor(n.category), fontSize: 11 }}>
                                  {n.category}
                                </span>
                              </td>
                              <td>👁 {n.views}</td>
                              <td>{formatDate(n.createdAt)}</td>
                              <td>
                                <span style={{ fontSize: 12, color: n.isPublished ? '#16a34a' : 'var(--muted)' }}>
                                  {n.isPublished ? '● Live' : '● Draft'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My News */}
            {tab === 'my-news' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>My Articles</h2>
                  <button className="btn btn-primary" onClick={() => { setEditingNews(null); setShowForm(true); }}>
                    + New Article
                  </button>
                </div>

                {loading ? (
                  <div className="loading-center"><div className="spinner"></div></div>
                ) : myNews.length === 0 ? (
                  <div style={{ background: 'var(--white)', borderRadius: 8, padding: 60, textAlign: 'center', boxShadow: 'var(--shadow)', color: 'var(--muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>No articles yet</h3>
                    <p>Start writing and share your stories with the world.</p>
                    <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowForm(true)}>
                      Write First Article
                    </button>
                  </div>
                ) : (
                  <div style={{ background: 'var(--white)', borderRadius: 8, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Article</th>
                            <th>Category</th>
                            <th>Views</th>
                            <th>Published</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myNews.map(n => (
                            <tr key={n._id}>
                              <td style={{ maxWidth: 250 }}>
                                <Link to={`/news/${n.slug}`} style={{ fontWeight: 500, color: 'var(--ink)' }}>
                                  {truncate(n.title, 60)}
                                </Link>
                              </td>
                              <td>
                                <span className="badge" style={{ background: getCategoryColor(n.category) + '20', color: getCategoryColor(n.category), fontSize: 11 }}>
                                  {n.category}
                                </span>
                              </td>
                              <td>👁 {n.views}</td>
                              <td style={{ fontSize: 13 }}>{formatDate(n.createdAt)}</td>
                              <td>
                                <span style={{ fontSize: 12, fontWeight: 500, color: n.isPublished ? '#16a34a' : 'var(--muted)' }}>
                                  {n.isPublished ? '● Live' : '● Draft'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => { setEditingNews(n); setShowForm(true); }}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(n._id)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {tab === 'profile' && (
              <div style={{ background: 'var(--white)', borderRadius: 8, padding: 32, boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
                  Edit Profile
                </h2>
                <form onSubmit={handleProfileSave}>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center' }}>
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, border: '3px solid var(--accent)' }}>
                        {getInitials(profileForm.name)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Avatar URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={profileForm.avatar}
                        onChange={e => setProfileForm(f => ({ ...f, avatar: e.target.value }))}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={user?.email} disabled style={{ background: 'var(--paper-dark)', cursor: 'not-allowed' }} />
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Email cannot be changed</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-input"
                      value={profileForm.bio}
                      onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Tell readers about yourself..."
                      style={{ minHeight: 100 }}
                      maxLength={200}
                    />
                    <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>{profileForm.bio.length}/200</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? '⏳ Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security */}
            {tab === 'security' && (
              <div style={{ background: 'var(--white)', borderRadius: 8, padding: 32, boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Change Password</h2>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
                  Make sure to use a strong password you don't use elsewhere.
                </p>
                <form onSubmit={handlePasswordChange} style={{ maxWidth: 400 }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passForm.currentPassword}
                      onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passForm.newPassword}
                      onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passForm.confirmPassword}
                      onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      required
                    />
                    {passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword && (
                      <p className="form-error">Passwords don't match</p>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Changing...' : '🔒 Change Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* News form modal */}
      {showForm && (
        <NewsForm
          existing={editingNews}
          onClose={() => { setShowForm(false); setEditingNews(null); }}
          onSaved={() => fetchMyNews()}
        />
      )}
    </div>
  );
}