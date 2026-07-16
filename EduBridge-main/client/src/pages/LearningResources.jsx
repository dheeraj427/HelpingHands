import { useState } from 'react';
// import '../styles/LearningResources.css' // We are using scoped styles below for a guaranteed premium look!

const materials = [
  { title: 'Class 6-8 Science Notes', type: 'PDF', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { title: 'Class 9-10 Maths Workbook', type: 'PDF', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { title: 'English Grammar Guide', type: 'PDF', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

const videos = [
  { title: 'Introduction to Algebra', channel: 'Khan Academy', link: 'https://www.khanacademy.org' },
  { title: 'Basic Science Experiments', channel: 'NCERT', link: 'https://www.ncert.nic.in' },
  { title: 'English Speaking Practice', channel: 'BBC Learning', link: 'https://www.bbc.co.uk/learningenglish' },
];

const usefulLinks = [
  { title: 'NCERT Official Website', link: 'https://www.ncert.nic.in' },
  { title: 'Khan Academy', link: 'https://www.khanacademy.org' },
  { title: 'Diksha Platform', link: 'https://diksha.gov.in' },
  { title: 'ePathshala', link: 'https://epathshala.nic.in' },
];

function LearningResources() {
  const [search, setSearch] = useState("");

  // Helper function to filter any array of items based on the search term
  const filterItems = (items) => {
    return items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      (item.channel && item.channel.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const filteredMaterials = filterItems(materials);
  const filteredVideos = filterItems(videos);
  const filteredLinks = filterItems(usefulLinks);

  return (
    <div className="resources-page">
      
      {}
      <div className="resources-hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="resources-hero-content">
          <span className="eyebrow">📚 HelpingHands Learning Hub</span>
          <h1>Free Learning Resources</h1>
          <p>Discover study materials, educational videos and trusted learning platforms carefully selected for students, teachers and volunteers.</p>
          
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="🔍 Search for notes, videos, or platforms..."
              className="resource-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {}
      <div className="resources-body">

        {/* Section 1: Study Materials */}
        <section className="resources-section">
          <h2 className="section-title">📄 Study Materials</h2>
          {filteredMaterials.length > 0 ? (
            <div className="resources-grid">
              {filteredMaterials.map((m, i) => (
                <div className="resource-card" key={i}>
                  <div className="card-header">
                    <div className="resource-icon">📓</div>
                    <span className="type-badge pdf">{m.type}</span>
                  </div>
                  <div className="card-body">
                    <h3>{m.title}</h3>
                    <p>Download printable study material prepared for school students.</p>
                  </div>
                  <div className="card-footer">
                    <a href={m.link} target="_blank" rel="noreferrer" download className="btn-access">📥 Download</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No study materials found matching "{search}".</p>
          )}
        </section>

        {/* Section 2: Educational Videos */}
        <section className="resources-section">
          <h2 className="section-title">🎥 Educational Videos</h2>
          {filteredVideos.length > 0 ? (
            <div className="resources-grid">
              {filteredVideos.map((v, i) => (
                <div className="resource-card" key={i}>
                  <div className="card-header">
                    <div className="resource-icon">🎬</div>
                    <span className="type-badge video">VIDEO</span>
                  </div>
                  <div className="card-body">
                    <span className="category-tag">{v.channel}</span>
                    <h3>{v.title}</h3>
                  </div>
                  <div className="card-footer">
                    <a href={v.link} target="_blank" rel="noreferrer" className="btn-access video-btn">▶ Watch Now</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No videos found matching "{search}".</p>
          )}
        </section>

        {/* Section 3: Useful Platforms */}
        <section className="resources-section">
          <h2 className="section-title">🌐 Useful Platforms</h2>
          {filteredLinks.length > 0 ? (
            <div className="links-grid">
              {filteredLinks.map((l, i) => (
                <a key={i} href={l.link} target="_blank" rel="noreferrer" className="useful-link-card">
                  <span className="link-text">{l.title}</span>
                  <span className="link-arrow">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="empty-state">No platforms found matching "{search}".</p>
          )}
        </section>

      </div>

      {}
      <style>{`
        /* Base Page Styles */
        .resources-page {
          min-height: 100vh;
          background-color: #040a16;
          color: #e2e8f0;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Hero Section */
        .resources-hero {
          position: relative;
          padding: 80px 20px;
          text-align: center;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, #040a16 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hero-glow-1 {
          position: absolute;
          top: -100px;
          left: 10%;
          width: 400px;
          height: 400px;
          background: #3B82F6;
          filter: blur(150px);
          opacity: 0.2;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-glow-2 {
          position: absolute;
          top: 50px;
          right: 10%;
          width: 350px;
          height: 350px;
          background: #8B5CF6;
          filter: blur(150px);
          opacity: 0.15;
          border-radius: 50%;
          pointer-events: none;
        }

        .resources-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .eyebrow {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .resources-hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 20px 0;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .resources-hero-content p {
          font-size: 1.15rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        /* Search Bar */
        .search-bar-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .resource-search {
          width: 100%;
          padding: 20px 25px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .resource-search:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }

        /* Main Body & Sections */
        .resources-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        .section-title {
          font-size: 1.8rem;
          color: #fff;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .empty-state {
          color: #64748b;
          font-style: italic;
          background: rgba(255,255,255,0.02);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.1);
        }

        /* Grid System */
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        /* Resource Card */
        .resource-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .resource-card:hover {
          transform: translateY(-5px);
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .resource-icon {
          font-size: 2rem;
          background: rgba(255, 255, 255, 0.05);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .type-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-badge.video {
          background: rgba(239, 68, 68, 0.15);
          color: #FCA5A5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .type-badge.pdf {
          background: rgba(16, 185, 129, 0.15);
          color: #6EE7B7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .card-body {
          flex-grow: 1;
        }

        .category-tag {
          color: #3B82F6;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }

        .card-body h3 {
          font-size: 1.25rem;
          color: #fff;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .card-body p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .card-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
        }

        .btn-access {
          display: block;
          text-align: center;
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .btn-access:hover {
          background: #3B82F6;
        }

        .video-btn:hover {
          background: #EF4444;
        }

        /* Useful Links Grid */
        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .useful-link-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          text-decoration: none;
          color: #cbd5e1;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .useful-link-card:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.4);
          color: #fff;
          transform: translateX(5px);
        }

        .link-arrow {
          color: #3B82F6;
          font-weight: bold;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .useful-link-card:hover .link-arrow {
          transform: translate(3px, -3px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .resources-hero-content h1 {
            font-size: 2.2rem;
          }
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default LearningResources;