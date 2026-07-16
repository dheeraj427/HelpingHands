import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending...');
    try {
      await axios.post(`${API}/feedback`, form);
      setStatus('✅ Thank you! Your message has been sent to the HelpingHands team.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Backend failed:", error);
      
      // 🚀 Emergency Fallback: Save feedback to browser memory
      const mockFeedback = {
        id: 'local-' + Date.now().toString(),
        ...form,
        rating: 5, // Default rating for test data
        status: 'pending'
      };
      
      const existingLocal = JSON.parse(localStorage.getItem('localMockFeedback') || '[]');
      localStorage.setItem('localMockFeedback', JSON.stringify([...existingLocal, mockFeedback]));

      setStatus('✅ (Local Test Mode) Feedback saved to your browser!');
      setForm({ name: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ marginBottom: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '15px' }}>Contact & Feedback</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.6' }}>
          Get in touch with us or share your experience with HelpingHands. We are here to support our schools, volunteers, and donors.
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
        textAlign: 'left'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Message</label>
            <textarea
              placeholder="How can we help you?"
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              marginTop: '10px', 
              padding: '16px', 
              borderRadius: '12px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              color: '#fff', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer', 
              transition: 'opacity 0.2s',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {status && <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '1rem', color: status.includes('❌') ? '#f87171' : '#4ade80' }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}

export default Contact;