import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { appStoreMockData } from '../mockData';
import type { AppDefinition } from '../mockData';

const AppDetailPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = appStoreMockData.find(a => a.id === appId);

  // Mock function to handle install/uninstall
  // In a real app, this would likely update global state or re-fetch data
  const handleInstallToggle = (currentApp: AppDefinition) => {
    alert(`Mock: Toggling install status for ${currentApp.name}. New status: ${!currentApp.installed}`);
    // Here you would typically update the app.installed status in your state management solution
    // For this mock, we don't dynamically update the shared appStoreMockData directly from here to avoid complexities
    // The UI might not reflect the change immediately unless state is managed and re-renders triggered.
  };

  if (!app) {
    return (
      <>
        <PageHeader title="App Not Found" />
        <div className="content-page">
          <div className="card">
            <p>Sorry, the application with ID "{appId}" could not be found.</p>
            <Link to="/app-store" className="btn btn-primary">Back to App Store</Link>
          </div>
        </div>
      </>
    );
  }

  const pageTitle = app.isNode ? `Node Details: ${app.name}` : `App Details: ${app.name}`;

  return (
    <>
      <PageHeader title={pageTitle} />
      <div className="content-page app-detail-page">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(app.isNode ? '/nodes' : '/app-store')} style={{marginBottom: 'var(--padding-md)'}}>
          <i className="ri-arrow-left-s-line"></i> Back to {app.isNode ? 'Node Management' : 'App Store'}
        </button>

        <div className="card app-detail-header">
          <i className={`${app.icon || (app.isNode ? 'ri-server-line' : 'ri-apps-line')} ri-4x`}></i>
          <div>
            <h2>{app.name} {app.subName ? <span className="app-subname-detail">{app.subName}</span> : ''} <span className="app-version-badge">v{app.version}</span></h2>
            <p className="app-category-detail">Category: {app.category}</p>
            <p>Developer: {app.developer}</p>
          </div>
          <div className="app-detail-actions">
            {app.isCore ? (
              <button className="btn btn-primary" disabled>Core Feature</button>
            ) : app.installed ? (
              <button className="btn btn-warning" onClick={() => handleInstallToggle(app)}>Uninstall</button>
            ) : (
              <button className="btn btn-primary" onClick={() => handleInstallToggle(app)}>Install</button>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Description</h3>
          <p style={{whiteSpace: 'pre-wrap'}}>{app.long_description || app.description}</p>
        </div>

        {app.gallery && app.gallery.length > 0 && (
          <div className="card">
            <h3>Screenshots</h3>
            <div className="app-gallery-mock grid-container" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--padding-sm)'}}>
              {app.gallery.map((imgSrc, index) => (
                <div className="card" key={index} style={{padding: '0'}}>
                  <img src={imgSrc} alt={`${app.name} screenshot ${index + 1}`} style={{width:'100%', height: 'auto', display:'block', borderRadius: 'var(--border-radius-sm)'}}/>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h3>Details & Requirements</h3>
          <p><strong>Supported Networks:</strong> {app.supported_networks_display ? app.supported_networks_display.join(', ') : 'N/A'}</p>
          <p><strong>Dependencies:</strong> {app.dependencies_display ? app.dependencies_display.join(', ') : 'None'}</p>
          {app.isNode && app.activeNetwork && (
             <p><strong>Currently Active Network:</strong> {app.activeNetwork}</p>
          )}
        </div>

        {(app.repo || app.website || app.support) && (
            <div className="card">
                <h3>Links</h3>
                {app.repo && <p><a href={app.repo} target="_blank" rel="noopener noreferrer" className="text-link">Repository <i className="ri-external-link-line"></i></a></p>}
                {app.website && <p><a href={app.website} target="_blank" rel="noopener noreferrer" className="text-link">Website <i className="ri-external-link-line"></i></a></p>}
                {app.support && <p><a href={app.support} target="_blank" rel="noopener noreferrer" className="text-link">Support <i className="ri-external-link-line"></i></a></p>}
            </div>
        )}
      </div>
    </>
  );
};

export default AppDetailPage; 