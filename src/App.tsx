import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Inbound } from './pages/Inbound';
import { Outbound } from './pages/Outbound';
import { Lockout } from './pages/Lockout';
import { Equipment } from './pages/Equipment';
import { Timeclock } from './pages/Timeclock';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/inbound" replace />} />
          <Route path="/inbound" element={<Inbound />} />
          <Route path="/outbound" element={<Outbound />} />
          <Route path="/lockout" element={<Lockout />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/timeclock" element={<Timeclock />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
