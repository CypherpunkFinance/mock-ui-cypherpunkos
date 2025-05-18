import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDefinition } from '../mockData';

interface AppCardProps {
  app: AppDefinition;
  onInstall?: (appId: string) => void;
  onUninstall?: (appId: string) => void;
  isInstalledView?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ app, onInstall, onUninstall, isInstalledView }) => {
  const navigate = useNavigate();

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstalledView) {
      if (app.isNode) {
        // For nodes in installed view, primary action might be Start/Stop
        // Or navigate to node details for more complex management
        alert(`Mock: ${app.running ? 'Stopping' : 'Starting'} node ${app.name}`);
        // Potentially update state here
      } else {
        // For general apps in installed view, primary action is usually 'Open'
        alert(`Mock: Opening app ${app.name}`);
        // Potentially navigate to a specific app route if available, or app details
        // navigate(`/app-detail/${app.id}`);
      }
    } else {
      // App Store view
      if (app.installed) {
        navigate(`/app-detail/${app.id}`);
      } else if (onInstall) {
        onInstall(app.id);
      }
    }
  };

  const handleDetailsAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (app.isNode) {
        navigate(`/node-detail/${app.id}`);
    } else {
        navigate(`/app-detail/${app.id}`);
    }
  };

  const handleUninstallAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUninstall && confirm(`Are you sure you want to uninstall ${app.name}?`)) {
      onUninstall(app.id);
    }
  };

  let primaryButtonText = 'Install';
  let primaryButtonClass = 'btn btn-primary btn-sm';

  if (isInstalledView) {
    if (app.isNode) {
      primaryButtonText = app.running ? 'Stop' : 'Start';
      primaryButtonClass = `btn ${app.running ? 'btn-danger' : 'btn-success'} btn-sm`;
    } else {
      primaryButtonText = 'Open';
      primaryButtonClass = 'btn btn-primary btn-sm';
    }
  } else {
    if (app.installed) {
      primaryButtonText = 'View Details';
      primaryButtonClass = 'btn btn-secondary btn-sm';
    }
  }

  return (
    <div className="card app-store-item" onClick={handleDetailsAction} data-app-id={app.id} style={{cursor: 'pointer'}}>
      <div className="app-info">
        <i className={`${app.icon || 'ri-apps-line'} ri-2x`}></i>
        <div>
          <h4>{app.name} {app.subName ? <span className="app-subname">{app.subName}</span> : ''}</h4>
          <p className="app-category"><small>{app.category}</small></p>
          <p className="app-description-short">{app.description}</p>
        </div>
      </div>
      <div className="app-controls">
        <button className={primaryButtonClass} onClick={handlePrimaryAction}>
          {primaryButtonText}
        </button>
        {isInstalledView ? (
          <>
            <button className="btn btn-secondary btn-sm" onClick={handleDetailsAction}>Details</button>
            {app.isNode && <Link to={`/logs/${app.id}`} className="btn btn-secondary btn-sm" onClick={(e) => e.stopPropagation()}>Logs</Link>}
            {!app.isCore && <button className="btn btn-warning btn-sm" onClick={handleUninstallAction}>Uninstall</button>}
          </>
        ) : (
          // In App Store, if not installed and onInstall is not provided, or if installed, show Details button.
          (app.installed || !onInstall) && <button className="btn btn-secondary btn-sm" onClick={handleDetailsAction}>Details</button>
        )}
      </div>
    </div>
  );
};

export default AppCard;
