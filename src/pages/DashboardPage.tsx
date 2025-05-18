import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { appStoreMockData, getNodeDisplayName } from '../mockData';
// import type { AppDefinition } from '../mockData'; // Removed - TS6133

const DashboardPage: React.FC = () => {
    const nodeset = appStoreMockData.find(app => app.id === 'nodeset');
    const baseNode = appStoreMockData.find(app => app.id === 'l2-base');
    // For the external Arbitrum RPC, we now have a mock AppDefinition
    const arbitrumExternalNode = appStoreMockData.find(app => app.id === 'external-arb-l2-custom');

    const uniswapApp = appStoreMockData.find(app => app.id === 'uniswap-interface');
    const aaveApp = appStoreMockData.find(app => app.id === 'aave-interface');
    const tornadoApp = appStoreMockData.find(app => app.id === 'tornado-cash-interface');

    return (
        <>
            <PageHeader title="Dashboard" />
            <div className="content-page dashboard-content">
                {/* Top Row: Resources, Alerts, Wallet */}
                <div className="dashboard-top-row">
                    <div className="card system-resources-card top-row-card">
                        <h3>System Resources</h3>
                        <p>CPU Usage: <span className="progress-bar-container small"><span className="progress-bar" style={{ width: '35%' }}>35%</span></span></p>
                        <p>Memory: <span className="progress-bar-container small"><span className="progress-bar" style={{ width: '26%' }}>4.2GB / 16GB</span></span></p>
                        <p>Disk (SSD): <span className="progress-bar-container small"><span className="progress-bar" style={{ width: '60%' }}>1.2TB / 2TB</span></span></p>
                    </div>

                    <div className="card alerts-card top-row-card">
                        <h3>Recent Alerts</h3>
                        <ul>
                            <li><span className="status-dot status-red"></span> Arbitrum RPC Unreachable (5 mins ago)</li>
                            <li><span className="status-dot status-yellow"></span> Low disk space warning (1 hour ago)</li>
                            <li><span className="status-dot status-green"></span> Nodeset L1 client updated successfully (3 hours ago)</li>
                        </ul>
                    </div>

                    <div className="card wallet-summary-card top-row-card">
                        <h3>Inbuilt Wallet Summary</h3>
                        <p><strong>Active Network:</strong> Ethereum Mainnet</p>
                        <p><strong>Total Value (ETH):</strong> ~1.25 ETH (mock)</p>
                        <p><strong>Total Value (USD):</strong> ~$4,375.00 (mock)</p>
                        <Link to="/wallet" className="btn btn-secondary btn-sm">Open Wallet</Link>
                    </div>
                </div>

                {/* Bottom Grid: Apps and Chains */}
                <h3 className="dashboard-section-title">Chain Status & Quick Access Apps</h3>
                <div className="grid-container">
                    {/* L1 Node Card */}
                    {nodeset && (
                        <div className="card system-status-card">
                            <h3>{getNodeDisplayName(nodeset)}</h3>
                            <p className="status-line"><span className="status-dot status-green"></span>Synced</p>
                            <p><strong>Current Block:</strong> <code>19876543</code> / 19876545</p>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: '99.99%' }}>99.99%</div>
                            </div>
                            <p className="eta">ETA: &lt;1 min</p>
                            <p><i className="ri-server-line"></i> Peers: 50</p>
                        </div>
                    )}

                    {/* L2 Base Node Card */}
                    {baseNode && (
                        <div className="card system-status-card">
                            <h3>{getNodeDisplayName(baseNode)}</h3>
                            <p className="status-line"><span className="status-dot status-green"></span>Synced</p>
                            <p><strong>Current Block:</strong> <code>1234567</code></p>
                            <p><i className="ri-server-line"></i> Peers: 25</p>
                            <p><small>L1 RPC: Nodeset (Local)</small></p>
                        </div>
                    )}

                    {/* L2 Arbitrum Card (External RPC Mock) */}
                    {arbitrumExternalNode && (
                        <div className="card system-status-card">
                            <h3>{getNodeDisplayName(arbitrumExternalNode)}</h3>
                            <p className="status-line"><span className={`status-dot status-${arbitrumExternalNode.running ? 'green' : 'red'}`}></span>
                                {arbitrumExternalNode.running ? 'Connected' : (arbitrumExternalNode.hasError ? 'Error' : 'Unknown')}
                            </p>
                            {arbitrumExternalNode.hasError && <p><strong>Details:</strong> Unreachable</p> }
                            {arbitrumExternalNode.rpcUrl && <p><small>RPC: {arbitrumExternalNode.rpcUrl}</small></p> }
                        </div>
                    )}

                    {/* App Status Cards */}
                    {uniswapApp && (
                        <div className="card app-status-card">
                            <h3>App: {uniswapApp.name} Interface</h3>
                            <p className="status-line"><span className={`status-dot status-${uniswapApp.running ? 'green' : 'yellow'}`}></span>{uniswapApp.running ? 'Running' : 'Stopped'}</p>
                            <p>Network: {uniswapApp.activeNetwork?.includes('Base') ? 'Base Mainnet' : uniswapApp.activeNetwork}</p>
                            <p><small>RPC: External (my-base-rpc.com)</small></p>
                        </div>
                    )}

                    {aaveApp && (
                        <div className="card app-status-card">
                            <h3>App: {aaveApp.name} Interface</h3>
                             <p className="status-line"><span className={`status-dot status-${aaveApp.running ? 'green' : 'yellow'}`}></span>{aaveApp.running ? 'Running' : 'Stopped'}</p>
                            <p>Network: {aaveApp.activeNetwork || 'Not Selected'}</p>
                        </div>
                    )}
                    
                    {tornadoApp && (
                        <div className="card app-status-card">
                            <h3>App: {tornadoApp.name}</h3>
                            <p className="status-line"><span className={`status-dot status-${tornadoApp.hasError ? 'red' : (tornadoApp.running ? 'green' : 'yellow')}`}></span>{tornadoApp.hasError ? 'Error' : (tornadoApp.running ? 'Running' : 'Stopped')}</p>
                            <p>Network: {tornadoApp.activeNetwork}</p>
                            <p><small>Details: Proving keys not found.</small></p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardPage; 