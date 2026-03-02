//npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResidenceLife from './Pages/Inbound'
import Outbound from './Pages/outbound'
import ResidentLockout from './Pages/ResidentLockOut'
import EquipmentCheckOut from './Pages/EquipmentCheckOut'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResidenceLife />} />
        <Route path="/outbound" element={<Outbound />} />
        <Route path="/lockout" element={<ResidentLockout />} />
        <Route path="/equipment" element={<EquipmentCheckOut />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App