import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SchoolProfile from './pages/SchoolProfile'
import LearningResources from './pages/LearningResources'
import VolunteerHub from './pages/VolunteerHub'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <Navbar />
      {/* Added paddingTop to prevent the fixed navbar from hiding the titles */}
      <main style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/schools"   element={<SchoolProfile />} />
          <Route path="/resources" element={<LearningResources />} />
          <Route path="/volunteer" element={<VolunteerHub />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/admin"     element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App