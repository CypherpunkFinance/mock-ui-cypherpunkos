import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';

// Mock data structures for settings (can be expanded and moved to a store/context later)
// Removed ExternalRpcConfig and L2NetworkSetting interfaces as they are no longer used here

const SettingsPage: React.FC = () => {
  // System Settings State
  const [theme, setTheme] = useState('dark');

  // Removed L1 and L2 Network Settings State and their handlers

  // Subgraph Settings State
  const [subgraphNetwork, setSubgraphNetwork] = useState('ethereum_l1');
  const [subgraphApp, setSubgraphApp] = useState('global');
  const [subgraphUrl, setSubgraphUrl] = useState('');

  // Mock Action Handlers
  const mockAction = (message: string) => alert(`Mock: ${message}`);

  return (
    <>
      <PageHeader title="Settings" />
      <div className="content-page">
        {/* System Settings Card */}
        <div className="card">
          <h3><i className="ri-sound-module-line"></i> System</h3>
          <p>CypherpunkOS Version: <code>0.1.0-alpha</code> (mock)</p>
          <button className="btn btn-secondary btn-sm" onClick={() => mockAction('Checking for updates...')}>Check for Updates</button>
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="theme-select" style={{ marginRight: '0.5rem' }}>Theme:</label>
            <select id="theme-select" className="input-mock" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark Mode (Cypherpunk Green)</option>
              <option value="light">Light Mode (mock - not implemented)</option>
            </select>
          </div>
          <button className="btn btn-danger btn-sm" style={{ marginTop: '1rem' }} onClick={() => mockAction('Factory Reset initiated! (Not really)')}>Factory Reset (mock)</button>
        </div>

        {/* Network Configuration Card - Entire card removed */}

        {/* Subgraph URL Configuration Card */}
        <div className="card">
          <h3><i className="ri-links-line"></i> Subgraph URL Configuration (Advanced)</h3>
          <p>Optionally override default subgraph URLs...</p>
          <div className="subgraph-config-item">
            <label htmlFor="subgraph-network-select" style={{ marginRight: '0.5rem' }}>Network:</label>
            <select id="subgraph-network-select" className="input-mock" value={subgraphNetwork} onChange={(e) => setSubgraphNetwork(e.target.value)}>
              <option value="ethereum_l1">Ethereum Mainnet</option>
              <option value="base_mainnet">Base Mainnet</option>
              <option value="arbitrum_one">Arbitrum One</option>
              {/* Add other configured networks dynamically if needed */}
            </select>
            <br />
            <label htmlFor="subgraph-app-select" style={{ marginRight: '0.5rem', marginTop: '0.5rem', display: 'inline-block' }}>Application (Optional):</label>
            <select id="subgraph-app-select" className="input-mock" value={subgraphApp} onChange={(e) => setSubgraphApp(e.target.value)}>
              <option value="global">Global for Network</option>
              <option value="uniswap-interface">Uniswap Interface</option>
              <option value="aave-interface">Aave Interface</option>
              {/* Dynamically list installed apps that might use subgraphs */}
            </select>
            <br />
            <label htmlFor="subgraph-url-input" style={{ marginRight: '0.5rem', marginTop: '0.5rem', display: 'inline-block' }}>Subgraph URL:</label>
            <input type="text" id="subgraph-url-input" className="input-mock" placeholder="https://your-custom-subgraph.com/path" value={subgraphUrl} onChange={(e) => setSubgraphUrl(e.target.value)} style={{width: 'calc(100% - 150px)'}}/>
            <br />
            <button className="btn btn-primary btn-sm" style={{ marginTop:'1rem' }} onClick={() => mockAction('Subgraph preference saved!')}>Save Preference</button>
          </div>
          <p style={{ marginTop:'1rem' }}><small>If not set, apps will use their default public subgraph URLs...</small></p>
        </div>

      </div>
    </>
  );
};

export default SettingsPage; 