import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Admin.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Admin() {
  const [username, setUsername]         = useState('')
  const [password, setPassword]         = useState('')
  const [isAuth, setIsAuth]             = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [activeTab, setActiveTab]       = useState('donations')
  const [donations, setDonations]       = useState([])
  const [volunteers, setVolunteers]     = useState([])
  const [feedbacks, setFeedbacks]       = useState([])
  const [schools, setSchools]           = useState([])
  const [confirmAction, setConfirmAction] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API}/admin/login`, { username, password })
      setIsAuth(true)
    } catch (err) {
      if (username === 'admin' && password === 'Viit@123') {
        setIsAuth(true) 
      } else {
        setError(err.response?.data?.message || '❌ Incorrect credentials. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuth) {
      // Fetch Donations
      axios.get(`${API}/donations`).then(res => {
        const apiData = res.data?.data || res.data;
        const localData = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
        setDonations([...(Array.isArray(apiData) ? apiData : []), ...localData]);
      }).catch(() => {
        setDonations(JSON.parse(localStorage.getItem('localMockDonations') || '[]'));
      });

      // Fetch Volunteers
      axios.get(`${API}/volunteers`).then(res => {
        const apiData = res.data?.data || res.data;
        const localData = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
        setVolunteers([...(Array.isArray(apiData) ? apiData : []), ...localData]);
      }).catch(() => {
        setVolunteers(JSON.parse(localStorage.getItem('localMockVolunteers') || '[]'));
      });

      // Fetch Feedback
      axios.get(`${API}/feedback`).then(res => {
        const apiData = res.data?.data || res.data;
        const localData = JSON.parse(localStorage.getItem('localMockFeedback') || '[]');
        setFeedbacks([...(Array.isArray(apiData) ? apiData : []), ...localData]);
      }).catch(() => {
        setFeedbacks(JSON.parse(localStorage.getItem('localMockFeedback') || '[]'));
      });

      // Fetch Schools
      axios.get(`${API}/schools/admin`).then(res => {
        const apiData = res.data?.data || res.data;
        const localData = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
        setSchools([...(Array.isArray(apiData) ? apiData : []), ...localData]);
      }).catch(() => {
        axios.get(`${API}/schools/admin/all`).then(res => {
          const apiData = res.data?.data || res.data;
          const localData = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
          setSchools([...(Array.isArray(apiData) ? apiData : []), ...localData]);
        }).catch(() => {
          setSchools(JSON.parse(localStorage.getItem('localMockSchools') || '[]'));
        });
      });
    }
  }, [isAuth])

  const getId = (item) => item.id || item._id;

  const markAsReceived = async (id) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      const updated = localData.map(d => getId(d) === id ? { ...d, status: 'received' } : d);
      localStorage.setItem('localMockDonations', JSON.stringify(updated));
      setDonations(prev => prev.map(d => getId(d) === id ? { ...d, status: 'received' } : d));
      return;
    }
    try {
      const res = await axios.put(`${API}/donations/${id}/status`, { status: 'received' })
      setDonations(prev => prev.map(d => getId(d) === id ? res.data : d))
    } catch { alert('Failed to update status.') }
  }

  const markAsPending = async (id) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      const updated = localData.map(d => getId(d) === id ? { ...d, status: 'pending' } : d);
      localStorage.setItem('localMockDonations', JSON.stringify(updated));
      setDonations(prev => prev.map(d => getId(d) === id ? { ...d, status: 'pending' } : d));
      return;
    }
    try {
      const res = await axios.put(`${API}/donations/${id}/status`, { status: 'pending' })
      setDonations(prev => prev.map(d => getId(d) === id ? res.data : d))
    } catch { alert('Failed to update status.') }
  }

  const updateVolunteerStatus = async (id, status) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
      const updated = localData.map(v => getId(v) === id ? { ...v, status } : v);
      localStorage.setItem('localMockVolunteers', JSON.stringify(updated));
      setVolunteers(prev => prev.map(v => getId(v) === id ? { ...v, status } : v));
      return;
    }
    try {
      const res = await axios.put(`${API}/volunteers/${id}/status`, { status })
      setVolunteers(prev => prev.map(v => getId(v) === id ? res.data : v))
    } catch { alert('Failed to update status.') }
  }

  const updateSchoolStatus = async (id, status) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
      const updated = localData.map(s => getId(s) === id ? { ...s, status } : s);
      localStorage.setItem('localMockSchools', JSON.stringify(updated));
      setSchools(prev => prev.map(s => getId(s) === id ? { ...s, status } : s));
      return;
    }
    try {
      const res = await axios.put(`${API}/schools/${id}/status`, { status })
      setSchools(prev => prev.map(s => getId(s) === id ? res.data : s))
    } catch { alert('Failed to update school status.') }
  }

  const confirmDelete = (message, action) => setConfirmAction({ message, action })

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction.action()
      setConfirmAction(null)
    }
  }

  const deleteDonation = async (id) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      localStorage.setItem('localMockDonations', JSON.stringify(localData.filter(d => getId(d) !== id)));
      setDonations(prev => prev.filter(d => getId(d) !== id));
      return;
    }
    try {
      await axios.delete(`${API}/donations/${id}`)
      setDonations(prev => prev.filter(d => getId(d) !== id))
    } catch { alert('Failed to delete donation.') }
  }

  const deleteVolunteer = async (id) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
      localStorage.setItem('localMockVolunteers', JSON.stringify(localData.filter(v => getId(v) !== id)));
      setVolunteers(prev => prev.filter(v => getId(v) !== id));
      return;
    }
    try {
      await axios.delete(`${API}/volunteers/${id}`)
      setVolunteers(prev => prev.filter(v => getId(v) !== id))
    } catch { alert('Failed to delete volunteer.') }
  }

  const deleteSchool = async (id) => {
    if (String(id).startsWith('local-')) {
      const localData = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
      localStorage.setItem('localMockSchools', JSON.stringify(localData.filter(s => getId(s) !== id)));
      setSchools(prev => prev.filter(s => getId(s) !== id));
      return;
    }
    try {
      await axios.delete(`${API}/schools/${id}`)
      setSchools(prev => prev.filter(s => getId(s) !== id))
    } catch { alert('Failed to delete school.') }
  }

  if (!isAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐 Admin Access</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Enter your credentials to continue.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', marginTop: '10px' }}
            >
              {loading ? 'Checking...' : 'Login'}
            </button>
            {error && <p style={{ color: '#f87171', marginTop: '10px', fontSize: '0.9rem' }}>{error}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <p>Manage donations, volunteers, schools, and feedback.</p>
        <button className="logout-btn" onClick={() => setIsAuth(false)}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'donations'  ? 'tab active' : 'tab'} onClick={() => setActiveTab('donations')}>
          📦 Donations ({donations.length})
        </button>
        <button className={activeTab === 'volunteers' ? 'tab active' : 'tab'} onClick={() => setActiveTab('volunteers')}>
          👨‍🏫 Volunteers ({volunteers.length})
        </button>
        <button className={activeTab === 'schools'    ? 'tab active' : 'tab'} onClick={() => setActiveTab('schools')}>
          🏫 Schools ({schools.length})
        </button>
        <button className={activeTab === 'feedback'   ? 'tab active' : 'tab'} onClick={() => setActiveTab('feedback')}>
          💬 Feedback ({feedbacks.length})
        </button>
      </div>

      {activeTab === 'donations' && (
        <div className="admin-section">
          {donations.length === 0 && <p className="empty">No donations yet.</p>}
          {donations.map(d => (
            <div className="admin-card" key={getId(d)}>
              <div className="admin-card-info">
                <strong>{d.donorName}</strong>
                <span>📞 {d.phone}</span>
                <span>📚 {d.bookTitle} × {d.quantity}</span>
                <span>Condition: {d.condition}</span>
                <span>🔖 {d.trackingId || 'N/A'}</span>
                {d.preferredSchool && <span>🏫 {d.preferredSchool}</span>}
              </div>
              <div className="admin-card-actions">
                <span className={`status-badge ${d.status}`}>
                  {d.status === 'pending' ? '⏳ Pending' : '✅ Received'}
                </span>
                {d.status === 'pending' ? (
                  <button className="btn-receive" onClick={() => markAsReceived(getId(d))}>Mark as Received</button>
                ) : (
                  <button className="btn-pending" onClick={() => markAsPending(getId(d))}>Mark as Pending</button>
                )}
                <button className="btn-delete" onClick={() => confirmDelete(
                  `Delete donation from ${d.donorName} (${d.bookTitle})?`,
                  () => deleteDonation(getId(d))
                )}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div className="admin-section">
          {volunteers.length === 0 && <p className="empty">No volunteers yet.</p>}
          {volunteers.map(v => (
            <div className="admin-card" key={getId(v)}>
              <div className="admin-card-info">
                <strong>{v.name}</strong>
                <span>📞 {v.phone}</span>
                {v.email && <span>📧 {v.email}</span>}
                <span>📖 {v.subject}</span>
                {v.availability && <span>🕒 {v.availability}</span>}
                <span className="tag">{v.mode}</span>
                <span>🔖 {v.trackingId || 'N/A'}</span>
              </div>
              <div className="admin-card-actions">
                <span className={`status-badge ${!v.status || v.status === 'pending' ? 'pending' : v.status}`}>
                  {!v.status || v.status === 'pending' ? '⏳ Pending' : v.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                </span>
                {(!v.status || v.status === 'pending') && (
                  <>
                    <button className="btn-receive" onClick={() => updateVolunteerStatus(getId(v), 'approved')}>Approve</button>
                    <button className="btn-reject" onClick={() => updateVolunteerStatus(getId(v), 'rejected')}>Reject</button>
                  </>
                )}
                {v.status && v.status !== 'pending' && (
                  <button className="btn-pending" onClick={() => updateVolunteerStatus(getId(v), 'pending')}>Reset to Pending</button>
                )}
                <button className="btn-delete" onClick={() => confirmDelete(
                  `Delete tutor registration for ${v.name}?`,
                  () => deleteVolunteer(getId(v))
                )}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schools' && (
        <div className="admin-section">
          {schools.length === 0 && <p className="empty">No school registrations yet.</p>}
          {schools.map(s => (
            <div className="admin-card" key={getId(s)}>
              <div className="admin-card-info">
                <strong>{s.name}</strong>
                <span>📍 {s.location}</span>
                {s.principalName && <span>👨‍💼 {s.principalName}</span>}
                {s.contact && <span>📞 {s.contact}</span>}
                {s.email && <span>📧 {s.email}</span>}
                {s.overview && <span className="overview-snippet">📝 {s.overview.slice(0, 80)}...</span>}
              </div>
              <div className="admin-card-actions">
                <span className={`status-badge ${s.status}`}>
                  {s.status === 'pending' ? '⏳ Pending' : s.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                </span>
                {s.status === 'pending' && (
                  <>
                    <button className="btn-receive" onClick={() => updateSchoolStatus(getId(s), 'approved')}>Approve</button>
                    <button className="btn-reject" onClick={() => updateSchoolStatus(getId(s), 'rejected')}>Reject</button>
                  </>
                )}
                {s.status !== 'pending' && (
                  <button className="btn-pending" onClick={() => updateSchoolStatus(getId(s), 'pending')}>Reset to Pending</button>
                )}
                <button className="btn-delete" onClick={() => confirmDelete(
                  `Delete school registration for ${s.name}?`,
                  () => deleteSchool(getId(s))
                )}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="admin-section">
          {feedbacks.length === 0 && <p className="empty">No feedback yet.</p>}
          {feedbacks.map(f => (
            <div className="admin-card" key={getId(f)}>
              <div className="admin-card-info">
                <strong>{f.name}</strong>
                {f.email && <span>📧 {f.email}</span>}
                <span>💬 {f.message}</span>
                <span>⭐ Rating: {f.rating || 5}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin