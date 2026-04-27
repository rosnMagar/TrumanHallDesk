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
            <Route path="/equipment/inventory" element={<EquipmentInventory />} />
            <Route path="/timeclock" element={<Timeclock />} />
            <Route path="/picture-lookup" element={<PictureLookup />} />
            <Route path="/admin/allowed-users" element={<AllowedUsers />} />
            <Route path="/admin/datastream-users" element={<DatastreamUsers />} />
            <Route path="/admin/maintain-student" element={<MaintainStudentList />} />
            <Route path="/admin/activity-cards" element={<ActivityCards />} />
            <Route path="/admin/activity-items" element={<ActivityItemsList />} />
            <Route path="/admin/timeclock-logs" element={<TimeclockLogs />} />
            <Route path="/admin/user-info-upload" element={<UserInfoUpload />} />
            <Route path="/admin/provision-worker" element={<ProvisionWorker />} />
            <Route path="/forward-package" element={<ForwardPackage />} />
          </Routes>
        </BrowserRouter>
      )}
    </Authenticator>
  )
}

export default App