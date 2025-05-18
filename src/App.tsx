import { Routes, Route /*, Navigate*/ } from 'react-router-dom';
import Sidebar from './components/Sidebar';
// MainContent will now be a layout for pages rather than a direct content displayer
// import MainContent from './components/MainContent'; 

import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import ChainsPage from './pages/ChainsPage';
import AppStorePage from './pages/AppStorePage';
import InstalledAppsPage from './pages/InstalledAppsPage';
import SettingsPage from './pages/SettingsPage';
import LogsPage from './pages/LogsPage';
import AppDetailPage from './pages/AppDetailPage';
import ChainDetailPage from './pages/ChainDetailPage';
import EnableChainsPage from './pages/EnableChainsPage';

// The MainContent structure (header + content area) will be part of each page or a Layout component.
// For now, we will use a simplified MainContent wrapper directly in App.tsx for the <Outlet /> or page components.

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content"> {/* This replaces the old MainContent component for layout purposes */}
        {/* Header will be managed by each page or a shared Layout component via Outlet context later */}
        {/* <header className="main-header"> ... </header> */}
        <div className="content-area" id="content-area">
          <Routes>
            {/* <Route path="/" element={<Navigate replace to="/dashboard" />} /> */}
            <Route path="/" element={<DashboardPage />} /> {/* Root now directly shows DashboardPage */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/chains" element={<ChainsPage />} />
            <Route path="/chains/enable" element={<EnableChainsPage />} />
            <Route path="/app-store" element={<AppStorePage />} />
            <Route path="/app-detail/:appId" element={<AppDetailPage />} />
            <Route path="/chain-detail/:chainId" element={<ChainDetailPage />} />
            <Route path="/installed-apps" element={<InstalledAppsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/logs/:logSourceId" element={<LogsPage />} />
            {/* Add a catch-all for unknown routes if desired */}
            <Route path="*" element={<div><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
