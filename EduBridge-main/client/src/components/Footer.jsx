import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const modalContent = {
    faq: {
      title: "Frequently Asked Questions",
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#333' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>How can I register my school?</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>You can navigate to the Schools tab and click "Register Your School". Our team will review your application and approve it within 48 hours.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Are my donations tax-deductible?</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>Yes! HelpingHands is a registered non-profit organization. All monetary and resource donations are eligible for tax deductions under applicable laws.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Who can become a volunteer?</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>Anyone with a passion for education can volunteer! Whether you want to teach, donate books, or help organize events, we have a place for you.</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>Last Updated: July 2026</strong></p>
          <p>At HelpingHands, we are committed to protecting your personal information and your right to privacy. When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously.</p>
          <p><strong>1. Information We Collect:</strong> We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our services, or otherwise contact us (e.g., as a volunteer or a school administrator).</p>
          <p><strong>2. How We Use Your Information:</strong> We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <p><strong>3. Will Your Information Be Shared?</strong> We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      body: (
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>Agreement to Terms</strong></p>
          <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and HelpingHands (“we,” “us” or “our”), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.</p>
          <p><strong>User Representations</strong></p>
          <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>
          <p><strong>Prohibited Activities</strong></p>
          <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
        </div>
      )
    }
  };

  // Modal Styles (Inline so it works instantly without touching CSS files)
  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 15, 30, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px'
  };

  const modalStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <>
      <footer style={{ background: '#0a0f1e', color: '#e4e7ef', padding: '60px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>❤️</div>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>HelpingHands</h2>
                <span style={{ fontSize: '12px', color: '#8b9bb4' }}>Empowering Education. Transforming Lives.</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#8b9bb4' }}>
              HelpingHands connects schools, volunteers and donors to build a brighter future through education, learning resources and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #2563EB', paddingBottom: '10px', display: 'inline-block' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/" style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Home</Link></li>
              <li><Link to="/schools" style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Schools</Link></li>
              <li><Link to="/resources" style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Resources</Link></li>
              <li><Link to="/volunteer" style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Volunteer</Link></li>
              <li><Link to="/contact" style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Contact</Link></li>
            </ul>
          </div>

        
           {/* Support */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #7C3AED', paddingBottom: '10px', display: 'inline-block' }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link 
                  to="/donate" 
                  onClick={() => window.scrollTo(0, 0)} 
                  style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}
                >
                  Donate Books
                </Link>
              </li>
              <li><Link to="/volunteer" onClick={() => window.scrollTo(0, 0)} style={{ color: '#8b9bb4', textDecoration: 'none', transition: '0.3s' }}>Become Volunteer</Link></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModal('faq'); }} style={{ background: 'none', border: 'none', color: '#8b9bb4', cursor: 'pointer', padding: 0, fontSize: '16px', textAlign: 'left' }}>FAQs</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModal('privacy'); }} style={{ background: 'none', border: 'none', color: '#8b9bb4', cursor: 'pointer', padding: 0, fontSize: '16px', textAlign: 'left' }}>Privacy Policy</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModal('terms'); }} style={{ background: 'none', border: 'none', color: '#8b9bb4', cursor: 'pointer', padding: 0, fontSize: '16px', textAlign: 'left' }}>Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #2563EB', paddingBottom: '10px', display: 'inline-block' }}>Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#8b9bb4', fontSize: '14px' }}><span>📍</span> Visakhapatnam, India</li>
              <li style={{ display: 'flex', gap: '10px', color: '#8b9bb4', fontSize: '14px' }}><span>📧</span> helpinghands@email.com</li>
              <li style={{ display: 'flex', gap: '10px', color: '#8b9bb4', fontSize: '14px' }}><span>📞</span> +91 76759 34417</li>
              <li style={{ display: 'flex', gap: '10px', color: '#8b9bb4', fontSize: '14px' }}><span>🕒</span> Mon - Sat | 9AM - 6PM</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {activeModal && (
        <div style={overlayStyle} onClick={() => setActiveModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{modalContent[activeModal].title}</h2>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto' }}>
              {modalContent[activeModal].body}
            </div>
            <div style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right', background: '#f8fafc', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button onClick={() => setActiveModal(null)} style={{ padding: '8px 16px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;