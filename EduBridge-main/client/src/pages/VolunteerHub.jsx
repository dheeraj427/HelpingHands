import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/VolunteerHub.css'

const API = import.meta.env.VITE_API_URL || 'https://helpinghands-2xly.onrender.com/api'

function VolunteerHub() {
  const [volunteers, setVolunteers] = useState([])
  const [donations, setDonations]   = useState([])

  const [tutorForm, setTutorForm]   = useState({ name: '', phone: '', email: '', subject: '', availability: '', mode: 'both' })
  const [donateForm, setDonateForm] = useState({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' })
  const [tutorMsg, setTutorMsg]     = useState('')
  const [donateMsg, setDonateMsg]   = useState('')
  const [newTutorTrackingId, setNewTutorTrackingId]   = useState('')
  const [newDonationTrackingId, setNewDonationTrackingId] = useState('')
  const [tutorCopied, setTutorCopied]     = useState(false)
  const [donationCopied, setDonationCopied] = useState(false)

  const [showAllTutors, setShowAllTutors]         = useState(false)
  const [showAllDonations, setShowAllDonations]   = useState(false)
  const [tutorSearch, setTutorSearch]             = useState('')
  const [donationSearch, setDonationSearch]       = useState('')

  const [modalItem, setModalItem] = useState(null)

  const [trackInput, setTrackInput]     = useState('')
  const [trackResult, setTrackResult]   = useState(null)
  const [trackError, setTrackError]     = useState('')
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackType, setTrackType]       = useState('donation')

  const [deleteInput, setDeleteInput]   = useState('')
  const [deleteType, setDeleteType]     = useState('donation')
  const [deleteMsg, setDeleteMsg]       = useState('')
  const [deleteError, setDeleteError]   = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      let apiVols = [], apiDons = [];
      try {
        const [volRes, donRes] = await Promise.all([
          axios.get(`${API}/volunteers`),
          axios.get(`${API}/donations`)
        ])
        apiVols = Array.isArray(volRes.data) ? volRes.data : []
        apiDons = Array.isArray(donRes.data) ? donRes.data : []
      } catch (err) {
        console.error("Backend fetch failed, relying on local storage", err)
      }

      // 🚀 Merge backend data with local storage data
      const localVols = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
      const localDons = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      
      setVolunteers([...apiVols, ...localVols])
      setDonations([...apiDons, ...localDons])
    }

    loadData()
  }, [])

  const handleTutorSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/volunteers`, tutorForm)
      setVolunteers(prev => [res.data, ...prev])
      setNewTutorTrackingId(res.data.trackingId)
      setTutorMsg('')
      setTutorForm({ name: '', phone: '', email: '', subject: '', availability: '', mode: 'both' })
    } catch {
      // 🚀 Emergency Fallback: Save to Local Storage
      const mockTrackingId = 'EDU-TUT-' + Math.floor(Math.random() * 90000 + 10000);
      const mockTutor = {
        id: 'local-' + Date.now(),
        trackingId: mockTrackingId,
        ...tutorForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingLocal = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
      localStorage.setItem('localMockVolunteers', JSON.stringify([mockTutor, ...existingLocal]));

      setVolunteers(prev => [mockTutor, ...prev]);
      setNewTutorTrackingId(mockTrackingId);
      setTutorMsg('');
      setTutorForm({ name: '', phone: '', email: '', subject: '', availability: '', mode: 'both' });
    }
  }

  const handleDonateSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/donations`, donateForm)
      setDonations(prev => [res.data, ...prev])
      setNewDonationTrackingId(res.data.trackingId)
      setDonateMsg('')
      setDonateForm({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' })
    } catch (err) {
      // 🚀 Emergency Fallback: Save to Local Storage
      const mockTrackingId = 'EDU-' + Math.floor(Math.random() * 900000 + 100000);
      const mockDonation = {
        id: 'local-' + Date.now(),
        trackingId: mockTrackingId,
        ...donateForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingLocal = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      localStorage.setItem('localMockDonations', JSON.stringify([mockDonation, ...existingLocal]));

      setDonations(prev => [mockDonation, ...prev]);
      setNewDonationTrackingId(mockTrackingId);
      setDonateMsg('');
      setDonateForm({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' });
    }
  }

  const handleTutorCopy = () => {
    navigator.clipboard.writeText(newTutorTrackingId)
    setTutorCopied(true)
    setTimeout(() => setTutorCopied(false), 2000)
  }

  const handleDonationCopy = () => {
    navigator.clipboard.writeText(newDonationTrackingId)
    setDonationCopied(true)
    setTimeout(() => setDonationCopied(false), 2000)
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    setTrackLoading(true)
    setTrackError('')
    setTrackResult(null)
    const searchId = trackInput.trim();
    
    try {
      if (trackType === 'donation') {
        try {
          const res = await axios.get(`${API}/donations/track/${searchId}`)
          setTrackResult({ type: 'donation', ...res.data })
        } catch (err) {
          // 🚀 Fallback: Check local state data
          const found = donations.find(d => d.trackingId === searchId)
          if (!found) throw new Error('not found')
          setTrackResult({ type: 'donation', ...found })
        }
      } else {
        // Tutor already searches state, which now includes local data!
        const found = volunteers.find(v => v.trackingId === searchId)
        if (!found) throw new Error('not found')
        setTrackResult({ type: 'tutor', ...found })
      }
    } catch (err) {
      setTrackError('❌ Tracking ID not found.')
    } finally {
      setTrackLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    setDeleteMsg('')
    setDeleteError('')
    const targetId = deleteInput.trim();
    
    try {
      if (deleteType === 'donation') {
        try {
          await axios.delete(`${API}/donations/track/${targetId}`)
        } catch (err) {
          // 🚀 Fallback: Delete from local storage
          const localDons = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
          if (!localDons.find(d => d.trackingId === targetId)) throw err;
          localStorage.setItem('localMockDonations', JSON.stringify(localDons.filter(d => d.trackingId !== targetId)));
        }
        setDonations(prev => prev.filter(d => d.trackingId !== targetId))
      } else {
        try {
          await axios.delete(`${API}/volunteers/track/${targetId}`)
        } catch (err) {
           // 🚀 Fallback: Delete from local storage
          const localVols = JSON.parse(localStorage.getItem('localMockVolunteers') || '[]');
          if (!localVols.find(v => v.trackingId === targetId)) throw err;
          localStorage.setItem('localMockVolunteers', JSON.stringify(localVols.filter(v => v.trackingId !== targetId)));
        }
        setVolunteers(prev => prev.filter(v => v.trackingId !== targetId))
      }
      setDeleteMsg('✅ Your submission has been deleted successfully.')
      setDeleteInput('')
    } catch (err) {
      setDeleteError('❌ Tracking ID not found.')
    } finally {
      setDeleteLoading(false)
      setConfirmDelete(false)
    }
  }

  const filteredTutors = volunteers.filter(v =>
    (v.name || '').toLowerCase().includes(tutorSearch.toLowerCase()) ||
    (v.subject || '').toLowerCase().includes(tutorSearch.toLowerCase()) ||
    (v.trackingId || '').toLowerCase().includes(tutorSearch.toLowerCase())
  )

  const filteredDonations = donations.filter(d =>
    (d.donorName || '').toLowerCase().includes(donationSearch.toLowerCase()) ||
    (d.bookTitle || '').toLowerCase().includes(donationSearch.toLowerCase()) ||
    (d.trackingId || '').toLowerCase().includes(donationSearch.toLowerCase())
  )

  const visibleTutors    = showAllTutors    ? filteredTutors    : volunteers.slice(0, 3)
  const visibleDonations = showAllDonations ? filteredDonations : donations.slice(0, 3)

  return (
    <div className="volunteer-page">
      <div className="volunteer-header">
        <h1>Volunteer Hub</h1>
        <p>Join our community — register as a tutor or donate books to support students.</p>
      </div>

      <div className="hub-grid">

        {/* Tutor Registration */}
        <section className="hub-section">
          <h2>📚 Register as a Tutor</h2>

          {newTutorTrackingId ? (
            <div className="tracking-success">
              <p>🎉 Registration submitted successfully!</p>
              <p>Your Tutor Tracking ID:</p>
              <div className="tracking-id-box">
                <span>{newTutorTrackingId}</span>
                <button onClick={handleTutorCopy}>{tutorCopied ? '✅ Copied!' : 'Copy'}</button>
              </div>
              <p className="tracking-note">Save this ID to track your registration status anytime.</p>
              <button className="donate-again-btn" onClick={() => setNewTutorTrackingId('')}>+ Register Another</button>
            </div>
          ) : (
            <form className="hub-form" onSubmit={handleTutorSubmit}>
              <input placeholder="Full Name *" value={tutorForm.name} onChange={e => setTutorForm({...tutorForm, name: e.target.value})} required />
              <input placeholder="Phone Number *" value={tutorForm.phone} onChange={e => setTutorForm({...tutorForm, phone: e.target.value})} required />
              <input placeholder="Email (optional)" value={tutorForm.email} onChange={e => setTutorForm({...tutorForm, email: e.target.value})} />
              <input placeholder="Subject you can teach *" value={tutorForm.subject} onChange={e => setTutorForm({...tutorForm, subject: e.target.value})} required />
              <input placeholder="Availability (e.g. Weekends)" value={tutorForm.availability} onChange={e => setTutorForm({...tutorForm, availability: e.target.value})} />
              <select value={tutorForm.mode} onChange={e => setTutorForm({...tutorForm, mode: e.target.value})}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>
              <button type="submit">Register as Tutor</button>
              {tutorMsg && <p className="form-msg">{tutorMsg}</p>}
            </form>
          )}

          <div className="list-section">
            <div className="list-header">
              <h3>Registered Tutors ({volunteers.length})</h3>
            </div>

            {showAllTutors && (
              <input
                className="search-input"
                placeholder="Search by name, subject, or tracking ID..."
                value={tutorSearch}
                onChange={e => setTutorSearch(e.target.value)}
              />
            )}

            {visibleTutors.length === 0 && <p className="empty">No tutors found.</p>}

            <div className={showAllTutors ? 'card-list scrollable' : 'card-list'}>
              {visibleTutors.map(v => (
                <div className="entry-card" key={v._id || v.id} onClick={() => setModalItem({ type: 'tutor', data: v })}>
                  <div className="entry-main">
                    <strong>{v.name}</strong>
                    <span>{v.subject}</span>
                  </div>
                  <span className={`status-tag ${!v.status || v.status === 'pending' ? 'pending' : v.status}`}>
                    {!v.status || v.status === 'pending' ? '⏳ Pending' : v.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                  </span>
                </div>
              ))}
            </div>

            {!showAllTutors && volunteers.length > 3 && (
              <button className="show-more-btn" onClick={() => setShowAllTutors(true)}>
                Show More ({volunteers.length - 3} more) ↓
              </button>
            )}
            {showAllTutors && (
              <button className="show-less-btn" onClick={() => { setShowAllTutors(false); setTutorSearch('') }}>
                Show Less ↑
              </button>
            )}
          </div>
        </section>

        {/* Book Donation */}
        <section className="hub-section">
          <h2>📖 Donate Books</h2>

          {newDonationTrackingId ? (
            <div className="tracking-success">
              <p>🎉 Donation request submitted!</p>
              <p>Your Donation Tracking ID:</p>
              <div className="tracking-id-box">
                <span>{newDonationTrackingId}</span>
                <button onClick={handleDonationCopy}>{donationCopied ? '✅ Copied!' : 'Copy'}</button>
              </div>
              <p className="tracking-note">Save this ID to track your donation status anytime.</p>
              <button className="donate-again-btn" onClick={() => setNewDonationTrackingId('')}>+ Donate Another Book</button>
            </div>
          ) : (
            <form className="hub-form" onSubmit={handleDonateSubmit}>
              <input placeholder="Your Name *" value={donateForm.donorName} onChange={e => setDonateForm({...donateForm, donorName: e.target.value})} required />
              <input placeholder="Phone Number *" value={donateForm.phone} onChange={e => setDonateForm({...donateForm, phone: e.target.value})} required />
              <input placeholder="Book Title *" value={donateForm.bookTitle} onChange={e => setDonateForm({...donateForm, bookTitle: e.target.value})} required />
              <input type="number" placeholder="Quantity" min="1" value={donateForm.quantity} onChange={e => setDonateForm({...donateForm, quantity: e.target.value})} required />
              <select value={donateForm.condition} onChange={e => setDonateForm({...donateForm, condition: e.target.value})}>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
              <input placeholder="Preferred School (optional)" value={donateForm.preferredSchool} onChange={e => setDonateForm({...donateForm, preferredSchool: e.target.value})} />
              <button type="submit">Submit Donation</button>
              {donateMsg && <p className="form-msg">{donateMsg}</p>}
            </form>
          )}

          <div className="list-section">
            <div className="list-header">
              <h3>Recent Donations ({donations.length})</h3>
            </div>

            {showAllDonations && (
              <input
                className="search-input"
                placeholder="Search by name, book title, or tracking ID..."
                value={donationSearch}
                onChange={e => setDonationSearch(e.target.value)}
              />
            )}

            {visibleDonations.length === 0 && <p className="empty">No donations found.</p>}

            <div className={showAllDonations ? 'card-list scrollable' : 'card-list'}>
              {visibleDonations.map(d => (
                <div className="entry-card" key={d._id || d.id} onClick={() => setModalItem({ type: 'donation', data: d })}>
                  <div className="entry-main">
                    <strong>{d.donorName}</strong>
                    <span>{d.bookTitle} × {d.quantity}</span>
                  </div>
                  <span className={`status-tag ${d.status}`}>
                    {d.status === 'pending' ? '⏳ Pending' : '✅ Received'}
                  </span>
                </div>
              ))}
            </div>

            {!showAllDonations && donations.length > 3 && (
              <button className="show-more-btn" onClick={() => setShowAllDonations(true)}>
                Show More ({donations.length - 3} more) ↓
              </button>
            )}
            {showAllDonations && (
              <button className="show-less-btn" onClick={() => { setShowAllDonations(false); setDonationSearch('') }}>
                Show Less ↑
              </button>
            )}
          </div>
        </section>

      </div>

      {/* Track Section */}
      <section className="track-section">
        <h2>🔍 Track My Request</h2>
        <p>Enter your Tracking ID to check the status of your tutor registration or book donation.</p>

        <div className="track-type-toggle">
          <button className={trackType === 'donation' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setTrackType('donation'); setTrackResult(null); setTrackError('') }}>
            📦 Donation
          </button>
          <button className={trackType === 'tutor' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setTrackType('tutor'); setTrackResult(null); setTrackError('') }}>
            👨‍🏫 Tutor
          </button>
        </div>

        <form className="track-form" onSubmit={handleTrack}>
          <input
            placeholder={trackType === 'donation' ? 'Enter Tracking ID (e.g. EDU-482910)' : 'Enter Tracking ID (e.g. EDU-TUT-482910)'}
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}
            required
          />
          <button type="submit">{trackLoading ? 'Tracking...' : 'Track'}</button>
        </form>

        {trackError && <p className="track-error">{trackError}</p>}

        {trackResult && trackResult.type === 'donation' && (
          <div className="track-result">
            <h3>Donation Status</h3>
            <div className="track-info">
              <p><strong>Tracking ID:</strong> {trackResult.trackingId}</p>
              <p><strong>Donor:</strong> {trackResult.donorName}</p>
              <p><strong>Book:</strong> {trackResult.bookTitle} × {trackResult.quantity}</p>
              <p><strong>Submitted:</strong> {new Date(trackResult.createdAt).toLocaleDateString()}</p>
              <div className={`track-status ${trackResult.status}`}>
                {trackResult.status === 'pending' ? '⏳ Pending — Our team will collect your books soon.' : '✅ Received — Thank you! Your books have been collected.'}
              </div>
            </div>
          </div>
        )}

        {trackResult && trackResult.type === 'tutor' && (
          <div className="track-result">
            <h3>Tutor Registration Status</h3>
            <div className="track-info">
              <p><strong>Tracking ID:</strong> {trackResult.trackingId}</p>
              <p><strong>Name:</strong> {trackResult.name}</p>
              <p><strong>Subject:</strong> {trackResult.subject}</p>
              <p><strong>Submitted:</strong> {new Date(trackResult.createdAt).toLocaleDateString()}</p>
              <div className={`track-status ${trackResult.status === 'approved' ? 'received' : trackResult.status === 'rejected' ? 'rejected' : 'pending'}`}>
                {trackResult.status === 'pending' && '⏳ Pending — Awaiting admin review.'}
                {trackResult.status === 'approved' && '✅ Approved — Welcome aboard! We will reach out soon.'}
                {trackResult.status === 'rejected' && '❌ Not approved at this time.'}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Delete by Tracking ID Section */}
      <section className="track-section delete-section">
        <h2>🗑️ Delete My Submission</h2>
        <p>Enter your Tracking ID to delete your tutor registration or book donation request.</p>

        <div className="track-type-toggle">
          <button className={deleteType === 'donation' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setDeleteType('donation'); setDeleteMsg(''); setDeleteError('') }}>
            📦 Donation
          </button>
          <button className={deleteType === 'tutor' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setDeleteType('tutor'); setDeleteMsg(''); setDeleteError('') }}>
            👨‍🏫 Tutor
          </button>
        </div>

        {!confirmDelete ? (
          <div className="track-form">
            <input
              placeholder={deleteType === 'donation' ? 'Enter Donation Tracking ID' : 'Enter Tutor Tracking ID'}
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
            />
            <button
              className="btn-delete-track"
              onClick={() => { if (deleteInput.trim()) setConfirmDelete(true) }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="confirm-inline">
            <p>⚠️ Are you sure you want to delete submission with ID <strong>{deleteInput}</strong>? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-confirm-delete" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button className="btn-confirm-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        )}

        {deleteMsg && <p className="form-msg" style={{marginTop: '1rem'}}>{deleteMsg}</p>}
        {deleteError && <p className="track-error">{deleteError}</p>}
      </section>

      {/* Modal */}
      {modalItem && (
        <div className="modal-overlay" onClick={() => setModalItem(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalItem(null)}>✕</button>

            {modalItem.type === 'tutor' && (
              <>
                <h3>👨‍🏫 Tutor Details</h3>
                <div className="modal-tracking-id">{modalItem.data.trackingId || 'No Tracking ID'}</div>
                <div className="modal-details">
                  <p><strong>Name:</strong> {modalItem.data.name}</p>
                  <p><strong>Phone:</strong> {modalItem.data.phone}</p>
                  {modalItem.data.email && <p><strong>Email:</strong> {modalItem.data.email}</p>}
                  <p><strong>Subject:</strong> {modalItem.data.subject}</p>
                  {modalItem.data.availability && <p><strong>Availability:</strong> {modalItem.data.availability}</p>}
                  <p><strong>Mode:</strong> {modalItem.data.mode}</p>
                  <p><strong>Registered:</strong> {new Date(modalItem.data.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-tag large ${!modalItem.data.status || modalItem.data.status === 'pending' ? 'pending' : modalItem.data.status}`}>
                  {!modalItem.data.status || modalItem.data.status === 'pending' ? '⏳ Pending' : modalItem.data.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                </span>
              </>
            )}

            {modalItem.type === 'donation' && (
              <>
                <h3>📖 Donation Details</h3>
                <div className="modal-tracking-id">{modalItem.data.trackingId}</div>
                <div className="modal-details">
                  <p><strong>Donor:</strong> {modalItem.data.donorName}</p>
                  <p><strong>Phone:</strong> {modalItem.data.phone}</p>
                  <p><strong>Book:</strong> {modalItem.data.bookTitle}</p>
                  <p><strong>Quantity:</strong> {modalItem.data.quantity}</p>
                  <p><strong>Condition:</strong> {modalItem.data.condition}</p>
                  {modalItem.data.preferredSchool && <p><strong>Preferred School:</strong> {modalItem.data.preferredSchool}</p>}
                  <p><strong>Submitted:</strong> {new Date(modalItem.data.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-tag large ${modalItem.data.status}`}>
                  {modalItem.data.status === 'pending' ? '⏳ Pending' : '✅ Received'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default VolunteerHub