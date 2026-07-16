import { Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">

        <div className="hero-content glass fadeUp">

          <span className="hero-eyebrow">
            ❤️ HelpingHands | Together We Build Better Education
          </span>

          <h1>
            Empowering Every Student Through{" "}
            <span className="highlight">HelpingHands</span>
          </h1>

          <p>
            HelpingHands connects government schools with passionate
            volunteers, educational resources, and generous donors to
            create equal learning opportunities for every child.
          </p>

          <div className="hero-btns">
            <Link to="/volunteer" className="btn-primary">
              Become a Volunteer
            </Link>

            <Link to="/schools" className="btn-secondary">
              Explore Schools
            </Link>
          </div>

        </div>

        <div className="hero-stats fadeUp">

          <div className="stat-card glass glow">
            <h2>15+</h2>
            <p>Schools Supported</p>
          </div>

          <div className="stat-card glass glow">
            <h2>350+</h2>
            <p>Active Volunteers</p>
          </div>

          <div className="stat-card glass glow">
            <h2>1200+</h2>
            <p>Books Donated</p>
          </div>

          <div className="stat-card glass glow">
            <h2>2500+</h2>
            <p>Students Impacted</p>
          </div>

        </div>

      </section>

      {/* About */}

      <section className="sdg-section section">

        <div className="sdg-content glass fadeUp">

          <div className="sdg-badge">
            ❤️ HelpingHands
          </div>

          <h2>Our Mission</h2>

          <p>
            HelpingHands believes every child deserves access to quality
            education regardless of their background.
          </p>

          <p>
            We connect schools, volunteers and donors on one platform,
            making it easier to contribute books, teach students and
            strengthen local communities through education.
          </p>

        </div>

      </section>

      {/* How it Works */}

      <section className="how-section section">

        <h2 className="fadeUp">
          How HelpingHands Works
        </h2>

        <div className="how-grid">

          <div className="how-card glass fadeUp">

            <div className="how-icon">
              📝
            </div>

            <h3>Register</h3>

            <p>
              Join HelpingHands as a volunteer, donor or supporter
              through our quick registration process.
            </p>

          </div>

          <div className="how-card glass fadeUp">

            <div className="how-icon">
              🤝
            </div>

            <h3>Connect</h3>

            <p>
              Our team matches volunteers and resources with schools
              that need them the most.
            </p>

          </div>

          <div className="how-card glass fadeUp">

            <div className="how-icon">
              🎓
            </div>

            <h3>Create Impact</h3>

            <p>
              Teach students, donate books and learning materials,
              inspire young minds and make a lasting difference.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Home