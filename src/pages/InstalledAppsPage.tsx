import React from 'react';
// import { Link } from 'react-router-dom'; // Removed - TS6133
import PageHeader from '../components/PageHeader';
import AppCard from '../components/AppCard';
import { getInstalledApps, appStoreMockData } from '../mockData'; // appStoreMockData needed if we manipulate it
// import type { AppDefinition } from '../mockData'; // Removed - TS6133

const InstalledAppsPage: React.FC = () => {
  // For this page, we only want non-node apps that are installed.
  // The getInstalledApps function from mockData.ts should already do this.
  const installedApps = getInstalledApps(appStoreMockData); // Pass the full list for filtering

  const handleUninstallApp = (appId: string) => {
    alert(`Mock: Uninstalling app ${appId}.`);
    // In a real app, update state, re-fetch data, etc.
    // Forcing a re-render or updating a local state copy of apps would be needed here
    // For now, the mock data doesn't change dynamically in the UI after this alert.
  };

  // Other handlers like start/stop/open would be managed within AppCard or via props if complex state changes are needed at page level

  return (
    <>
      <PageHeader title="Installed Applications" />
      <div className="content-page installed-apps-page">
        {installedApps.length > 0 ? (
          <div className="installed-apps-container">
            {/* This uses the same class as the app store grid for consistency, or could be unique */}
            {/* The AppCard component will be responsible for rendering based on isInstalledView */}
            {installedApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                isInstalledView={true} 
                onUninstall={handleUninstallApp}
                // onStart, onStop, onOpen could be passed if page needs to manage complex state changes
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{padding: 'var(--padding-lg)', textAlign: 'center'}}>
            <p>No applications installed yet.</p>
            <p><small>Visit the App Store to discover and install applications.</small></p>
          </div>
        )}
      </div>
    </>
  );
};

export default InstalledAppsPage; 