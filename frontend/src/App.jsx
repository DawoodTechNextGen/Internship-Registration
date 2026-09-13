
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import InternshipRegister from './pages/InternshipRegister'
import BootcampRegister from './pages/BootcampRegister'
import HackathonsLanding from './pages/HackathonsLanding'
import HackathonRegister from './pages/HackathonRegister'

function App() {
  return (
    <Routes>
      <Route path="/internship-registration" element={<InternshipRegister />} />
      <Route path="/bootcamp" element={<BootcampRegister />} />
      <Route path="/hackathons" element={<HackathonsLanding />} />
      <Route path="/hackathons/:slug/register" element={<HackathonRegister />} />
      <Route path="*" element={<Navigate to="/internship-registration" replace />} />
    </Routes>
  )
}

export default App
