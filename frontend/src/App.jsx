
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import InternshipRegister from './pages/InternshipRegister'
import BootcampRegister from './pages/BootcampRegister'

function App() {
  return (
    <Routes>
      <Route path="/internship-registration" element={<InternshipRegister />} />
      <Route path="/bootcamp" element={<BootcampRegister />} />
      <Route path="*" element={<Navigate to="/internship-registration" replace />} />
    </Routes>
  )
}

export default App
