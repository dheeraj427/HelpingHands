import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://helpinghands-2xly.onrender.com/api'

function BookDonation() {
  const [books, setBooks] = useState([])
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [filter, setFilter] = useState('all') 
  const [donateForm, setDonateForm] = useState({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' })
  const [formMsg, setFormMsg] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I am Milo. Welcome to HelpingHands Support. How can I help you today?', options: ['Donate a Book', 'Find Study Materials', 'Volunteer Opportunities', 'Contact Admin'] }
  ])

  // These 3 books will ALWAYS stay on the screen now
  const mockBooks = [
    { _id: 'mock1', bookTitle: 'Class 10 NCERT Mathematics', donorName: 'Ravi Kumar', quantity: 2, condition: 'good', status: 'available', preferredSchool: 'ZPHS Vizianagaram' },
    { _id: 'mock2', bookTitle: 'Concepts of Physics (H.C. Verma)', donorName: 'Anjali Sharma', quantity: 1, condition: 'new', status: 'taken', preferredSchool: 'GHS Madhurawada' },
    { _id: 'mock3', bookTitle: 'Wren & Martin English Grammar', donorName: 'Sai Kiran', quantity: 3, condition: 'fair', status: 'available', preferredSchool: 'GVMC School Vizag' }
  ]

  useEffect(() => {
    axios.get(`${API}/donations`)
      .then(res => {
        const fetched = res.data?.data || res.data
        let apiBooks = []
        if (Array.isArray(fetched)) {
          apiBooks = fetched.map(b => ({ ...b, status: b.status === 'received' ? 'taken' : 'available' }))
        }
        
        const localDons = JSON.parse(localStorage.getItem('localMockDonations') || '[]');
        // 🚀 ALWAYS merge the 3 mock books + real backend books + local test books
        setBooks([...mockBooks, ...apiBooks, ...localDons]);
      })
      .catch(() => {
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
      setTimeout(() => { setShowDonateModal(false); setFormMsg(''); setDonateForm({ donorName: '', phone: '', bookTitle: '', quantity: 1, condition: 'good', preferredSchool: '' }) }, 2000)
    } catch (err) {
      const localBook = { _id: 'local-' + Date.now(), ...donateForm, status: 'available', trackingId: 'EDU-' + Math.floor(Math.random() * 900000 + 100000) }
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
      botMsg.text = 'Wonderful! You can click the big "Offer a Book Now" button on this page to open the donor form.'
      botMsg.options = ['Back to Main Options', 'Contact Admin']
    } else if (option === 'Find Study Materials') {
      botMsg.text = 'You can find class notes over on our "Resources" tab in the navigation menu!'
      botMsg.options = ['Back to Main Options']
    } else if (option === 'Volunteer Opportunities') {
      botMsg.text = 'Go to the Volunteer page to submit a registration for online or offline teaching.'
      botMsg.options = ['Back to Main Options']
    } else if (option === 'Contact Admin') {
      botMsg.text = 'Head over to the Contact page to drop us a direct message.'
      botMsg.options = ['Back to Main Options']
    } else {
      botMsg.text = 'How else can I guide you today?'
      botMsg.options = ['Donate a Book', 'Find Study Materials', 'Volunteer Opportunities', 'Contact Admin']
    }
    setChatHistory(prev => [...prev, userMsg, botMsg])
  }

  const filteredBooks = books.filter(b => filter === 'all' || b.status === filter)

  return (
    <div className="donation-page">
      <div className="donation-hero">
        <div className="hero-content">
          <span className="eyebrow">📚 Book Marketplace</span>
          <h1>Empower Through Pages</h1>
          <p>Browse through books available for schools, or share the gift of knowledge by donating yours.</p>
          <button className="btn-trigger-donate" onClick={() => setShowDonateModal(true)}>+ Offer a Book Now</button>
        </div>
      </div>

      <div className="donation-container">
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('all')}>All Books ({books.length})</button>
          <button className={filter === 'available' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('available')}>🟢 Available ({books.filter(b=>b.status==='available').length})</button>
          <button className={filter === 'taken' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFilter('taken')}>🔴 Handed Over ({books.filter(b=>b.status==='taken').length})</button>
        </div>

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
              <select value={donateForm.condition} onChange={e => setDonateForm({...donateForm, condition: e.target.value})}>
                <option value="new">Brand New</option>
                <option value="good">Good / Readable</option>
                <option value="fair">Old / Used</option>
              </select>
              <input type="text" placeholder="Preferred Government School (Optional)" value={donateForm.preferredSchool} onChange={e => setDonateForm({...donateForm, preferredSchool: e.target.value})} />
              <button type="submit" className="submit-donation-btn">Submit to Marketplace</button>
              {formMsg && <p className="success-txt" style={{color: '#4ade80', marginTop:'10px', textAlign:'center'}}>{formMsg}</p>}
            </form>
          </div>
        </div>
      )}

      {/* MILO CHATBOT */}
      <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
        {!isOpen ? (
          <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
            💬 Ask Milo
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <h4 style={{margin:0, color:'white', display:'flex', alignItems:'center', gap:'8px'}}>🤖 Milo</h4>
              <button className="close-chat" onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'18px', cursor:'pointer'}}>✕</button>
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

      <style>{`
        .donation-page { min-height: 100vh; background-color: #040a16; color: #e2e8f0; padding-bottom: 80px; font-family: sans-serif; }
        .donation-hero { background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, #040a16 100%); padding: 80px 20px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .eyebrow { display: inline-block; padding: 6px 16px; background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
        .donation-hero h1 { font-size: 3rem; margin: 0 0 15px 0; color: white; }
        .btn-trigger-donate { padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #a855f7); border: none; border-radius: 12px; color: white; font-weight: bold; cursor: pointer; margin-top: 20px; font-size: 1.1rem; }
        
        .donation-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        .filter-tabs { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .tab-btn { padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; border-radius: 8px; cursor: pointer; }
        .tab-btn.active { background: #3B82F6; color: white; border-color: #3B82F6; }
        
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        .book-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; }
        .book-card.available { border-left: 5px solid #10b981; }
        .book-card.taken { border-left: 5px solid #ef4444; opacity: 0.6; }
        .book-status-banner { font-size: 0.85rem; font-weight: bold; margin-bottom: 15px; }
        .book-card h3 { margin: 0 0 15px 0; color: white; }
        .book-details p { margin: 5px 0; color: #94a3b8; font-size: 0.95rem; }
        .badge-condition { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; color: #e2e8f0; }

        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10000; }
        .modal-box { background: #0f172a; padding: 30px; border-radius: 20px; width: 90%; max-width: 500px; border: 1px solid rgba(255,255,255,0.1); position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
        .donate-popup-form { display: flex; flexDirection: column; gap: 15px; margin-top: 20px; }
        .donate-popup-form input, .donate-popup-form select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; box-sizing: border-box; margin-bottom:15px; }
        .submit-donation-btn { width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }

        /* MILO STYLES */
        .chatbot-widget { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
        .chatbot-toggle-btn { padding: 15px 25px; border-radius: 30px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-weight: bold; border: none; cursor: pointer; font-size: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); transition: transform 0.2s; }
        .chatbot-toggle-btn:hover { transform: scale(1.05); }
        .chat-window { width: 350px; height: 500px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { background: #1e293b; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        .chat-bubble-wrapper { display: flex; flex-direction: column; max-width: 85%; }
        .chat-bubble-wrapper.bot { align-self: flex-start; }
        .chat-bubble-wrapper.user { align-self: flex-end; align-items: flex-end; }
        .chat-bubble { padding: 12px 16px; border-radius: 16px; font-size: 0.95rem; line-height: 1.4; }
        .chat-bubble.bot { background: #1e293b; color: #e2e8f0; border-bottom-left-radius: 4px; }
        .chat-bubble.user { background: #3b82f6; color: white; border-bottom-right-radius: 4px; }
        .bot-options { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; width: 100%; }
        .opt-btn { padding: 8px 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; border-radius: 8px; cursor: pointer; text-align: left; font-size: 0.9rem; transition: background 0.2s; }
        .opt-btn:hover { background: rgba(59, 130, 246, 0.3); }
        
        @media (max-width: 768px) {
          .chatbot-widget { bottom: 15px; right: 15px; }
          .chat-window { width: 300px; height: 400px; }
        }
      `}</style>
    </div>
  )
}

export default BookDonation