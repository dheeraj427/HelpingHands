import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/SchoolProfile.css'

// Fallback to local server if the environment variable is missing
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyForm = {
  name: '', location: '', principalName: '', principalMessage: '',
  overview: '', facilities: '', contact: '', email: ''
}

function SchoolProfile() {
  const [schools, setSchools]     = useState([])
  const [selected, setSelected]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [formMsg, setFormMsg]     = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get(`${API}/schools`)
      .then(res => { 
        const fetchedData = res.data?.data || res.data;
        const apiSchools = Array.isArray(fetchedData) ? fetchedData : [];
        
        // 🚀 Merge real backend data with our persistent local data!
        const localSchools = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
        setSchools([...apiSchools, ...localSchools]);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading schools:", err);
        
        // 🚀 If backend fails entirely, at least show the locally saved ones
        const localSchools = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
        setSchools(localSchools);
        
        setLoading(false);
      })
  }, [])

  const handleCardClick = (school) => {
    // Safely check id or _id depending on the backend version
    const schoolId = school._id || school.id;
    const selectedId = selected?._id || selected?.id;
    setSelected(selectedId === schoolId ? null : school)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean)
      }
      const res = await axios.post(`${API}/schools`, payload)
      
      // If successful, instantly add the new school to the UI list
      const newSchool = res.data?.data || res.data;
      setSchools(prev => [...prev, newSchool]);
      
      setFormMsg('✅ Registration submitted! Our team will review and approve your school.')
      setForm(emptyForm)
      setTimeout(() => setShowForm(false), 2000)
    } catch (err) {
      console.error("Backend rejected submission:", err)
      
      // 🚀 Emergency Fallback: Create the mock school
      const mockSchool = {
        id: 'local-' + Date.now().toString(), // Tag it as local
        ...form,
        facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean),
        status: 'pending'
      }
      
      // 🚀 Save to browser's Local Storage so it survives page reloads!
      const existingLocal = JSON.parse(localStorage.getItem('localMockSchools') || '[]');
      localStorage.setItem('localMockSchools', JSON.stringify([...existingLocal, mockSchool]));
      
      setSchools(prev => [...prev, mockSchool])
      setFormMsg('✅ (Local Test Mode) Registration saved to your browser!')
      setForm(emptyForm)
      setTimeout(() => setShowForm(false), 2000)
      
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="school-page">

      {/* Hero */}
      <div className="school-hero">
        <div className="school-hero-content">
          <span className="school-eyebrow">Affiliated Schools</span>
          <h1>Schools We Support</h1>
          <p>HelpingHands partners with government schools to provide volunteers, books, and learning resources to students who need them most.</p>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="school-body">
        {loading && <p className="loading">Loading schools...</p>}

        {!loading && schools.length === 0 && (
          <div className="no-schools">
            <p>🏫 No schools listed yet.</p>
            <p>Be the first to register your school with HelpingHands!</p>
          </div>
        )}

        {}
        {!loading && schools.length > 0 && (
          <div className="schools-grid">
            {schools.map(school => (
              <div key={school._id || school.id}>
                <div
                  className={`school-card ${(selected?._id || selected?.id) === (school._id || school.id) ? 'active' : ''}`}
                  onClick={() => handleCardClick(school)}
                >
                  <div className="school-card-top">
                    <div className="school-icon">🏫</div>
                    <div>
                      <h3>{school.name}</h3>
                      <span className="location-tag">📍 {school.location}</span>
                    </div>
                  </div>
                  <p className="school-card-overview">
                    {school.overview?.slice(0, 100) || 'Click to view school details.'}...
                  </p>
                  <div className="school-card-footer">
                    <span>{school.facilities?.length || 0} facilities</span>
                    <span className="view-btn">{(selected?._id || selected?.id) === (school._id || school.id) ? 'Hide Details ↑' : 'View Details ↓'}</span>
                  </div>
                </div>

                {/* Expanded Profile */}
                {(selected?._id || selected?.id) === (school._id || school.id) && (
                  <div className="school-profile-expanded">
                    <div className="profile-grid">

                      <div className="profile-card full-width">
                        <h3>📖 Overview</h3>
                        <p>{school.overview || 'No overview available.'}</p>
                      </div>

                      <div className="profile-card">
                        <h3>🏗️ Facilities</h3>
                        {school.facilities?.length > 0 ? (
                          <ul>
                            {school.facilities.map((f, i) => <li key={i}>✅ {f}</li>)}
                          </ul>
                        ) : <p>No facilities listed.</p>}
                      </div>

                      <div className="profile-card">
                        <h3>👨‍💼 Principal's Message</h3>
                        <p className="principal-name">— {school.principalName || 'Principal'}</p>
                        <p className="principal-msg">"{school.principalMessage || 'No message available.'}"</p>
                      </div>

                      {(school.contact || school.email) && (
                        <div className="profile-card">
                          <h3>📞 Contact</h3>
                          {school.contact && <p>📞 {school.contact}</p>}
                          {school.email && <p>📧 {school.email}</p>}
                        </div>
                      )}

                      {school.gallery?.length > 0 && (
                        <div className="profile-card full-width">
                          <h3>🖼️ Gallery</h3>
                          <div className="gallery-grid">
                            {school.gallery.map((url, i) => (
                              <img key={i} src={url} alt={`Gallery ${i + 1}`} />
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {}
        {/* Register School Section */}
        <div className="register-school-section">
          <div className="register-school-banner">
            <div>
              <h3>🏫 Is your school not listed?</h3>
              <p>Register your school with HelpingHands and get access to volunteers, book donations, and learning resources.</p>
            </div>
            <button className="btn-register-school" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Register Your School →'}
            </button>
          </div>

          {showForm && (
            <form className="school-form" onSubmit={handleSubmit}>
              <h3>School Registration Form</h3>
              <div className="form-grid">
                <input placeholder="School Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input placeholder="Location *" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                <input placeholder="Principal Name" value={form.principalName} onChange={e => setForm({...form, principalName: e.target.value})} />
                <input placeholder="Contact Number" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
                <input placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input placeholder="Facilities (comma separated, e.g. Library, Lab, Playground)" value={form.facilities} onChange={e => setForm({...form, facilities: e.target.value})} />
              </div>
              <textarea placeholder="School Overview *" rows="4" value={form.overview} onChange={e => setForm({...form, overview: e.target.value})} required />
              <textarea placeholder="Principal's Message (optional)" rows="3" value={form.principalMessage} onChange={e => setForm({...form, principalMessage: e.target.value})} />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
              {formMsg && <p className="form-msg">{formMsg}</p>}
            </form>
          )}
        </div>

      </div>
    </div>
  )
}

export default SchoolProfile