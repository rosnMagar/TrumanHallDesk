//npm install react-router-dom
//R:66, G:35, B:107 - Purple
//R: 92, G: 166, B:221 - Blue
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResidenceLife from './Pages/Inbound'
import Outbound from './Pages/outbound'
import ResidentLockout from './Pages/ResidentLockOut'
import EquipmentCheckOut from './Pages/EquipmentCheckOut'
import Timeclock from './Pages/Timeclock'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

function App() {
  return (
    <Authenticator>
      {() => (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ResidenceLife />} />
            <Route path="/outbound" element={<Outbound />} />
            <Route path="/lockout" element={<ResidentLockout />} />
            <Route path="/equipment" element={<EquipmentCheckOut />} />
            <Route path="/timeclock" element={<Timeclock />} />
          </Routes>
        </BrowserRouter>
      )}
    </Authenticator>
  )
}

export default App