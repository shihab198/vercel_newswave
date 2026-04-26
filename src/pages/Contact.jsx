import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--ink)', color: 'white', padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            Contact Us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            Have a tip, feedback, or question? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '64px 24px 80px' }}>
        <div className="contact-grid">
          {/* Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
              Get In Touch
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
              Whether you have a breaking news tip, a correction request, partnership inquiry, or just want to say hello — our editorial team is ready to hear from you.
            </p>

            {[
              { icon: '📧', title: 'Email Us', info: 'news@newswave.com', sub: 'We respond within 24 hours' },
              { icon: '📞', title: 'Call Us', info: '+880 1234567890', sub: 'Sat–Thu, 9am–6pm EST' },
              { icon: '📍', title: 'Visit Us', info: '123 Press Avenue', sub: 'Dhaka 1216' },
              { icon: '⏰', title: 'Business Hours', info: 'Sat–Thu: 9am–6pm EST', sub: 'Breaking news covered 24/7' },
            ].map((item, i) => (
              <div key={i} className="contact-info-item">
                <div className="contact-icon">{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{item.title}</div>
                  <div style={{ color: 'var(--ink)', marginTop: 2 }}>{item.info}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ marginTop: 32, padding: 24, background: 'var(--paper-dark)', borderRadius: 8 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                Follow NewsWave
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: '𝕏', label: 'Twitter / X' },
                  { icon: 'f', label: 'Facebook' },
                  { icon: 'in', label: 'LinkedIn' },
                  { icon: '📷', label: 'Instagram' },
                ].map((s, i) => (
                  <a key={i} href="#" title={s.label} style={{
                    width: 44, height: 44, background: 'var(--ink)', color: 'white',
                    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, transition: 'background 0.2s', textDecoration: 'none'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c9410a'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--white)', borderRadius: 12, padding: 40, boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
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
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select
                  name="subject"
                  className="form-select"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject...</option>
                  <option value="news-tip">News Tip / Story Idea</option>
                  <option value="correction">Request a Correction</option>
                  <option value="advertising">Advertising & Partnership</option>
                  <option value="feedback">General Feedback</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-input"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  style={{ minHeight: 150 }}
                  required
                  maxLength={1000}
                />
                <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
                  {form.message.length}/1000
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                disabled={sending}
              >
                {sending ? '📨 Sending...' : '📤 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}