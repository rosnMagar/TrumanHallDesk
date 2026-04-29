import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResidenceLife from './Pages/Inbound'
import Outbound from './Pages/outbound'
import ResidentLockout from './Pages/ResidentLockOut'
import EquipmentCheckOut from './Pages/EquipmentCheckOut'
import EquipmentInventory from './Pages/EquipmentInventory'
import Timeclock from './Pages/Timeclock'
import AllowedUsers from './Pages/AllowedUsers'
import DatastreamUsers from './Pages/DatastreamUsers'
import MaintainStudentList from './Pages/MaintainStudentList'
import ActivityCards from './Pages/ActivityCards'
import ActivityItemsList from './Pages/ActivityItemsList'
import TimeclockLogs from './Pages/TimeclockLogs'
import PictureLookup from './Pages/PictureLookup'
import UserInfoUpload from './Pages/UserInfoUpload'
import ProvisionWorker from './Pages/ProvisionWorker'
import ForwardPackage from './Pages/FowardPackage'
import AdminRoute from './Components/AdminRoute'
import { AdminProvider } from './context/AdminContext'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

function App() {
  return (
    <Authenticator>
      {() => (
        <BrowserRouter>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<ResidenceLife />} />
              <Route path="/outbound" element={<Outbound />} />
              <Route path="/lockout" element={<ResidentLockout />} />
              <Route path="/equipment" element={<EquipmentCheckOut />} />
              <Route path="/equipment/inventory" element={<EquipmentInventory />} />
              <Route path="/timeclock" element={<Timeclock />} />
              <Route path="/picture-lookup" element={<PictureLookup />} />
              <Route path="/forward-package" element={<ForwardPackage />} />
              <Route path="/admin/allowed-users" element={<AdminRoute><AllowedUsers /></AdminRoute>} />
              <Route path="/admin/datastream-users" element={<AdminRoute><DatastreamUsers /></AdminRoute>} />
              <Route path="/admin/maintain-student" element={<AdminRoute><MaintainStudentList /></AdminRoute>} />
              <Route path="/admin/activity-cards" element={<AdminRoute><ActivityCards /></AdminRoute>} />
              <Route path="/admin/activity-items" element={<AdminRoute><ActivityItemsList /></AdminRoute>} />
              <Route path="/admin/timeclock-logs" element={<AdminRoute><TimeclockLogs /></AdminRoute>} />
              <Route path="/admin/user-info-upload" element={<AdminRoute><UserInfoUpload /></AdminRoute>} />
              <Route path="/admin/provision-worker" element={<AdminRoute><ProvisionWorker /></AdminRoute>} />
            </Routes>
          </AdminProvider>
        </BrowserRouter>
      )}
    </Authenticator>
  )
}

export default App