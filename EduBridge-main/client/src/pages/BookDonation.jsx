import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/BookDonation.css' 

const API = import.meta.env.VITE_API_URL || 'https://helpinghands-2xly.onrender.com/api'

function BookDonation() {
  // Marketplace & Form States
  const [books, setBooks] = useState([])
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [filter, setFilter] = useState('all') 
  const [donateForm, setDonateForm] = useState({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' })
  const [formMsg, setFormMsg] = useState('')

  // Chatbot States
  const [isOpen, setIsOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I am Milo. Welcome to HelpingHands Support. How can I help you today?', options: ['Donate a Book', 'Find Study Materials', 'Volunteer Opportunities', 'Contact Admin'] }
  ])

  const mockBooks = [
    { _id: '1', bookTitle: 'Class 10 NCERT Mathematics', donorName: 'Ravi Kumar', quantity: 2, condition: 'good', status: 'available', preferredSchool: 'ZPHS Vizianagaram' },
    { _id: '2', bookTitle: 'Concepts of Physics (H.C. Verma)', donorName: 'Anjali Sharma', quantity: 1, condition: 'new', status: 'taken', preferredSchool: 'GHS Madhurawada' },
    { _id: '3', bookTitle: 'Wren & Martin English Grammar', donorName: 'Sai Kiran', quantity: 3, condition: 'fair', status: 'available', preferredSchool: 'GVMC School Vizag' }
  ]

  useEffect(() => {
    // Try fetching live donations from backend
    axios.get(`${API}/donations`)
      .then(res => {
        const fetched = res.data?.data || res.data
        let mapped = []
        if (Array.isArray(fetched) && fetched.length > 0) {
          mapped = fetched.map(b => ({
            ...b,
            status: b.status === 'received' ? 'taken' : 'available'
          }))
        } else {
          mapped = mockBooks
        }
        
        // 🚀 Fetch from Local Storage and MERGE so data doesn't vanish on refresh!
        const localDons = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
        setBooks([...mapped, ...localDons]);
      })
      .catch(() => {
        // 🚀 If backend completely fails, still load local data!
        const localDons = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
        setBooks([...mockBooks, ...localDons])
      })
  }, [])

  const handleDonateSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/donations`, donateForm)
      const newBook = { ...(res.data?.data || res.data), status: 'available' }
      setBooks(prev => [newBook, ...prev])
      setFormMsg('✅ Book donation listed successfully!')
      setTimeout(() => {
        setShowDonateModal(false)
        setFormMsg('')
        setDonateForm({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' })
      }, 2000)
    } catch (err) {
      // Fallback to local array display if network drops
      const localBook = { _id: 'local-' + Date.now().toString(), ...donateForm, status: 'available', trackingId: 'EDU-' + Math.floor(Math.random() * 900000 + 100000) }
      
      // 🚀 Save to browser's Local Storage so it survives page reloads!
      const existingLocal = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
      localStorage.setItem('localMockDonations', JSON.stringify([localBook, ...existingLocal]));
      
      setBooks(prev => [localBook, ...prev])
      setFormMsg('✅ Listed in Test Mode successfully!')
      setTimeout(() => { setShowDonateModal(false); setFormMsg('') }, 2000)
    }
  }

  const handleOptionClick = (option) => {
    const userMsg = { sender: 'user', text: option }
    let botMsg = { sender: 'bot', text: '', options: [] }

    if (option === 'Donate a Book') {
      botMsg.text = 'Wonderful! You can click the big "Offer a Book Now" button on this page to open the donor form. We collect books and distribute them to needy schools.'
      botMsg.options = ['Back to Main Options', 'Contact Admin']
    } else if (option === 'Find Study Materials') {
      botMsg.text = 'You can find class notes, question workbooks, and NCERT links over on our "Resources" tab in the navigation menu!'
      botMsg.options = ['Back to Main Options', 'How to download?']
    } else if (option === 'Volunteer Opportunities') {
      botMsg.text = 'We are always looking for passionate tutors! Go to the Volunteer page to submit a registration for online or offline teaching.'
      botMsg.options = ['Back to Main Options']
    } else if (option === 'Contact Admin') {
      botMsg.text = 'Have specific queries? Head over to the Contact page to drop us a direct message, or email us at support@helpinghands.org.'
      botMsg.options = ['Back to Main Options']
    } else if (option === 'How to download?' || option === 'Back to Main Options') {
      botMsg.text = 'How else can I guide you today?'
      botMsg.options = ['Donate a Book', 'Find Study Materials', 'Volunteer Opportunities', 'Contact Admin']
    }

    setChatHistory(prev => [...prev, userMsg, botMsg])
  }

  const filteredBooks = books.filter(b => filter === 'all' || b.status === filter)

  return (
    <div className="donation-page">
      {/* Hero Banner */}
      <div className="donation-hero">
        <div className="hero-content">
          <span className="eyebrow">📚 Book Marketplace</span>
          <h1>Empower Through Pages</h1>
          <p>Browse through books available for schools, or share the gift of knowledge by donating yours.</p>
          <button className="btn-trigger-donate" onClick={() => setShowDonateModal(true)}>+ Offer a Book Now</button>
        </div>
      </div>

      {/* Main Filter Tabs */}
      <div className="donation-container">
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('all')}>All Books ({books.length})</button>
          <button className={filter === 'available' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('available')}>🟢 Available ({books.filter(b=>b.status==='available').length})</button>
          <button className={filter === 'taken' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('taken')}>🔴 Handed Over ({books.filter(b=>b.status==='taken').length})</button>
        </div>

        {/* Books Grid View */}
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div className={`book-card ${book.status}`} key={book._id}>
              <div className="book-status-banner">
                {book.status === 'available' ? '🟢 Available' : '📦 Handed Over to School'}
              </div>
              <h3>{book.bookTitle}</h3>
              <div className="book-details">
                <p><strong>Donor:</strong> {book.donorName}</p>
                <p><strong>Quantity:</strong> {book.quantity} copies</p>
                <p><strong>Condition:</strong> <span className="badge-condition" style={{textTransform: 'capitalize'}}>{book.condition}</span></p>
                {book.preferredSchool && <p><strong>Target Destination:</strong> 🏫 {book.preferredSchool}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donor Modal Popup */}
      {showDonateModal && (
        <div className="modal-overlay" onClick={() => setShowDonateModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDonateModal(false)}>✕</button>
            <h3>📖 Fill Book & Donor Details</h3>
            <form onSubmit={handleDonateSubmit} className="donate-popup-form">
              <input type="text" placeholder="Your Full Name *" value={donateForm.donorName} onChange={e => setDonateForm({...donateForm, donorName: e.target.value})} required />
              <input type="text" placeholder="Phone Number *" value={donateForm.phone} onChange={e => setDonateForm({...donateForm, phone: e.target.value})} required />
              <input type="text" placeholder="Book Title / Subject & Class *" value={donateForm.bookTitle} onChange={e => setDonateForm({...donateForm, bookTitle: e.target.value})} required />
              <input type="number" placeholder="Quantity" min="1" value={donateForm.quantity} onChange={e => setDonateForm({...donateForm, quantity: parseInt(e.target.value) || 1})} required />
              {/* 🚀 FIXED: Lowercase values to match database schema strictly! */}
              <select value={donateForm.condition} onChange={e => setDonateForm({...donateForm, condition: e.target.value})}>
                <option value="new">Brand New</option>
                <option value="good">Good / Readable</option>
                <option value="fair">Old / Used</option>
              </select>
              <input type="text" placeholder="Preferred Government School (Optional)" value={donateForm.preferredSchool} onChange={e => setDonateForm({...donateForm, preferredSchool: e.target.value})} />
              <button type="submit" className="submit-donation-btn">Submit to Marketplace</button>
              {formMsg && <p className="success-txt">{formMsg}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Flipkart style Floating Chatbot Widget */}
      <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
        {!isOpen ? (
          <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
            💬 Ask Milo
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <h4>🤖 Milo</h4>
              <button className="close-chat" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="chat-body">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-bubble-wrapper ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
                  {msg.options && (
                    <div className="bot-options">
                      {msg.options.map((opt, idx) => (
                        <button key={idx} className="opt-btn" onClick={() => handleOptionClick(opt)}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDonation