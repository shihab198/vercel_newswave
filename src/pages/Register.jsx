import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" className="logo" style={{ color: 'var(--ink)', fontSize: 32 }}>
            News<span style={{ color: '#c9410a' }}>Wave</span>
          </Link>
        </div>

        <h2 className="auth-title">Join NewsWave</h2>
        <p className="auth-subtitle">Create an account and start publishing today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="form-error">Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}