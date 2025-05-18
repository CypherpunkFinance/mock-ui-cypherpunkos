import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import {
  ALL_AVAILABLE_CHAINS,
  appStoreMockData,
  getPluginsForChain,
  isChainEnabled,
  setEnabledChainIds,
  mockLogs
} from '../mockData';
import type { ChainDefinition, AppDefinition } from '../mockData';

// Updated ChainConfig to match ChainsPage.tsx
interface ChainConfig {
  connectionType: 'plugin' | 'external' | 'none';
  externalRpcUrl?: string;
  statusText?: string;
  pluginDetails?: AppDefinition;
  availablePlugins?: AppDefinition[];
  selectedPluginId?: string;
}

const ChainDetailPage: React.FC = () => {
  const { chainId } = useParams<{ chainId: string }>();
  const navigate = useNavigate();

  const [chainDef, setChainDef] = useState<ChainDefinition | undefined>(undefined);
  const [chainConfig, setChainConfig] = useState<ChainConfig | undefined>(undefined);
  const [isEditingRpc, setIsEditingRpc] = useState<boolean>(false);
  const [tempRpcUrl, setTempRpcUrl] = useState<string>('');
  const [isGloballyEnabled, setIsGloballyEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!chainId) {
      navigate('/chains');
      return;
    }

    const globallyEnabled = isChainEnabled(chainId);
    setIsGloballyEnabled(globallyEnabled);

    if (!globallyEnabled) {
      navigate('/chains');
      return;
    }

    const currentChainDef = ALL_AVAILABLE_CHAINS.find(c => c.id === chainId);
    setChainDef(currentChainDef);

    if (currentChainDef) {
      const availablePlugins = getPluginsForChain(currentChainDef.id, appStoreMockData);
      let currentSelectedPlugin = availablePlugins.find(p => p.installed) || availablePlugins[0];
      
      let connectionTypeByDefault: ChainConfig['connectionType'] = 'none';
      let statusTextByDefault = 'Ready to configure';
      let externalRpcUrlByDefault = currentChainDef.defaultExternalRpcPlaceholder || '';

      const activeExternalConfig = appStoreMockData.find(app => 
        app.installed && 
        app.pluginForChainId === currentChainDef.id && 
        app.sourceType === 'external'
      );

      const activePluginConfig = currentSelectedPlugin && currentSelectedPlugin.installed ? 
        appStoreMockData.find(app => 
          app.id === currentSelectedPlugin!.id && 
          app.installed && 
          app.pluginForChainId === currentChainDef.id && 
          app.sourceType === 'plugin'
        ) : undefined;

      if (activeExternalConfig) {
        connectionTypeByDefault = 'external';
        externalRpcUrlByDefault = activeExternalConfig.rpcUrl || currentChainDef.defaultExternalRpcPlaceholder || '';
        statusTextByDefault = activeExternalConfig.running ? `Connected (External)` : (activeExternalConfig.hasError ? `Error (External)` : `Configured (External)`);
      } else if (activePluginConfig) {
        connectionTypeByDefault = 'plugin';
        statusTextByDefault = activePluginConfig.running ? `Running (${activePluginConfig.name})` : `Stopped (${activePluginConfig.name})`;
        if (activePluginConfig.hasError) statusTextByDefault = `Error (${activePluginConfig.name})`;
      } else {
        if (currentChainDef.supportsLocalNode && availablePlugins.length > 0) {
          connectionTypeByDefault = 'plugin';
          if (currentSelectedPlugin) {
            statusTextByDefault = currentSelectedPlugin.installed ? 
              (currentSelectedPlugin.running ? `Running (${currentSelectedPlugin.name})` : `Stopped (${currentSelectedPlugin.name})`) :
              `Plugin available: ${currentSelectedPlugin.name}`;
            if (currentSelectedPlugin.hasError && currentSelectedPlugin.installed) statusTextByDefault = `Error (${currentSelectedPlugin.name})`;
          } else {
            statusTextByDefault = 'Plugin(s) available, select to configure.';
          }
        } else if (!currentChainDef.supportsLocalNode) {
          connectionTypeByDefault = 'external';
          statusTextByDefault = 'External RPC (Not Configured)';
        } else {
          connectionTypeByDefault = 'none';
          statusTextByDefault = 'Ready to configure';
        }
      }
      
      setChainConfig({
        connectionType: connectionTypeByDefault,
        externalRpcUrl: externalRpcUrlByDefault,
        statusText: statusTextByDefault,
        pluginDetails: currentSelectedPlugin,
        availablePlugins: availablePlugins,
        selectedPluginId: currentSelectedPlugin?.id,
      });
      setTempRpcUrl(externalRpcUrlByDefault);
    }
  }, [chainId, navigate]);

  const handleSetConnectionType = (type: 'plugin' | 'external') => {
    if (!chainDef || !chainConfig) return;
    if (!isGloballyEnabled) {
      alert("This chain is not currently enabled. Configuration changes might not persist or apply globally.");
      return;
    }

    const currentChainId = chainDef.id;
    const currentPluginId = chainConfig.selectedPluginId;
    const currentExternalRpc = chainConfig.externalRpcUrl;

    if (type === 'plugin') {
      // Deactivate any external config for this chain
      appStoreMockData.forEach(app => {
        if (app.pluginForChainId === currentChainId && app.sourceType === 'external') {
          app.installed = false; // Mark as not the primary config
        }
      });
      // Activate the selected plugin
      if (currentPluginId) {
        const pluginToActivate = appStoreMockData.find(app => app.id === currentPluginId);
        if (pluginToActivate) {
          pluginToActivate.installed = true; // Mark as primary config (install action is separate)
        }
      }
    } else if (type === 'external') {
      // Potentially deactivate current plugin as primary (actual running state handled by plugin actions)
      // For now, focus on ensuring the external config is marked as installed/active.
      // if (currentPluginId) {
      //   const pluginToDeactivate = appStoreMockData.find(app => app.id === currentPluginId);
      //   if (pluginToDeactivate) { /* pluginToDeactivate.installed = false; ? */ }
      // }

      let externalConfig = appStoreMockData.find(app => 
        app.pluginForChainId === currentChainId && app.sourceType === 'external'
      );

      if (externalConfig) {
        externalConfig.rpcUrl = currentExternalRpc || chainDef.defaultExternalRpcPlaceholder || '';
        externalConfig.installed = true;
      } else if (currentExternalRpc && currentExternalRpc !== chainDef.defaultExternalRpcPlaceholder) {
        // Create a new one if a custom URL is provided and no existing external config
        appStoreMockData.push({
          id: `${currentChainId}-external-custom-${Date.now()}`,
          name: `${chainDef.name}`,
          subName: `External RPC`,
          icon: chainDef.icon,
          mainCategory: "Chain",
          category: `${chainDef.layer} Node`,
          description: `User-configured external RPC for ${chainDef.name}`,
          long_description: `User-configured external RPC endpoint for ${chainDef.name}.`,
          version: "N/A",
          developer: "User Configured",
          installed: true, // Active because it's being set as connection type
          running: false, // Assume not running until tested
          hasError: false,
          isNode: true,
          sourceType: "external",
          rpcUrl: currentExternalRpc,
          pluginForChainId: currentChainId,
        });
      }
    }

    setChainConfig(prev => {
      if (!prev) return prev;
      let newStatusText = prev.statusText;
      let rpcUrlToUse = prev.externalRpcUrl;

      if (type === 'plugin' && prev.pluginDetails) {
        newStatusText = prev.pluginDetails.running ? `Running (${prev.pluginDetails.name})` : `Stopped (${prev.pluginDetails.name})`;
      } else if (type === 'external') {
        if (!rpcUrlToUse && chainDef?.defaultExternalRpcPlaceholder) {
          rpcUrlToUse = chainDef.defaultExternalRpcPlaceholder;
        }
        newStatusText = rpcUrlToUse && rpcUrlToUse !== chainDef?.defaultExternalRpcPlaceholder ? `External RPC (Configured)` : `External RPC (Default)`;
        if (!rpcUrlToUse) newStatusText = 'External RPC (Not Configured)';
      }
      return {
        ...prev,
        connectionType: type,
        statusText: newStatusText,
        externalRpcUrl: rpcUrlToUse,
      };
    });
  };

  const handleSaveRpc = () => {
    if (!chainConfig) return;
    if (!isGloballyEnabled) {
      alert("This chain is not currently enabled. Configuration changes might not persist or apply globally.");
      return;
    }
    setChainConfig(prev => prev ? {
      ...prev,
      externalRpcUrl: tempRpcUrl,
      statusText: tempRpcUrl ? `External RPC (Saved)` : `External RPC (Not Configured)`,
    } : prev);
    setIsEditingRpc(false);
  };

  const handlePluginAction = (action: 'install' | 'uninstall' | 'start' | 'stop') => {
    if (!chainConfig || !chainConfig.pluginDetails || !chainId) return;
    if (!isGloballyEnabled) {
      alert("This chain is not currently enabled. Configuration changes might not persist or apply globally.");
      return;
    }

    const plugin = chainConfig.pluginDetails;
    alert(`Mock action: ${action} plugin ${plugin.name} for ${chainDef?.name}`);

    const pluginIndex = appStoreMockData.findIndex(p => p.id === plugin.id);
    if (pluginIndex > -1) {
      const targetPlugin = appStoreMockData[pluginIndex];
      if (action === 'install') targetPlugin.installed = true;
      if (action === 'uninstall') { targetPlugin.installed = false; targetPlugin.running = false; }
      if (action === 'start') { targetPlugin.installed = true; targetPlugin.running = true; targetPlugin.hasError = false;}
      if (action === 'stop') targetPlugin.running = false;
    }
    
    setChainConfig(prev => {
      if (!prev || !prev.pluginDetails) return prev;
      const newPluginDetails = { ...prev.pluginDetails };
      let newStatus = prev.statusText;

      if (action === 'install') newPluginDetails.installed = true;
      if (action === 'uninstall') { newPluginDetails.installed = false; newPluginDetails.running = false; }
      if (action === 'start') newPluginDetails.running = true;
      if (action === 'stop') newPluginDetails.running = false;
      
      if (newPluginDetails.installed) {
        newStatus = newPluginDetails.running ? `Running (${newPluginDetails.name})` : `Stopped (${newPluginDetails.name})`;
      } else {
        newStatus = `Not Installed (${newPluginDetails.name})`;
      }
      return {
        ...prev,
        pluginDetails: newPluginDetails,
        statusText: newStatus,
      };
    });
  };

  if (!chainId || !chainDef) {
    return (
      <>
        <PageHeader title="Chain Not Found" />
        <div className="content-page"><div className="card"><p>The specified chain could not be found.</p><Link to="/chains" className="btn btn-primary">Back to Chain Management</Link></div></div>
      </>
    );
  }
  if (!chainConfig) {
    return <><PageHeader title={`Details for ${chainDef.name}`} /><div className="content-page"><p>Loading chain configuration...</p></div></>;
  }

  const { name, layer, description, icon, supportsLocalNode, defaultExternalRpcPlaceholder, blockExplorerUrl } = chainDef;
  const { connectionType, externalRpcUrl, statusText, pluginDetails, availablePlugins, selectedPluginId } = chainConfig;
  const logIdForPlugin = pluginDetails?.id || chainId;
  const logSnippet = mockLogs[logIdForPlugin]?.split('\n').slice(-5).join('\n') || 'No recent logs available for this chain/plugin.';
  
  const isPluginRunning = connectionType === 'plugin' && pluginDetails?.installed && pluginDetails?.running;
  const currentBlock = isPluginRunning && pluginDetails?.id === "nodeset" ? "19876543" : (isPluginRunning ? "1234567" : "N/A");
  const highestBlock = isPluginRunning && pluginDetails?.id === "nodeset" ? "19876545" : (isPluginRunning ? "1234570" : "N/A");
  const syncProgress = (isPluginRunning && highestBlock !== "N/A" && currentBlock !== "N/A" && parseInt(highestBlock) !== 0) ? (parseInt(currentBlock) / parseInt(highestBlock) * 100).toFixed(2) + '%' : "N/A";
  const peers = isPluginRunning ? (pluginDetails?.id === "nodeset" ? "50" : "25") : "N/A";
  const l1RpcSourceDisplay = (isPluginRunning && layer === 'L2' && pluginDetails) ? (pluginDetails.id === 'l2-base-plugin' ? "L1 - Ethereum (Nodeset - Mock)" : "Configured L1 (Mock)") : "N/A";

  const mockNodeConfigText = `# Mock Configuration for ${name} (${connectionType})
${connectionType === 'plugin' && pluginDetails ? 
`PLUGIN_ID: ${pluginDetails.id}
PLUGIN_VERSION: ${pluginDetails.version}
RPC_PORT_INTERNAL: ${pluginDetails.port || 'N/A'}
DATA_PATH: /data/cypherpunkos/${pluginDetails.id}` : ''}
${connectionType === 'external' ? `EXTERNAL_RPC_URL: ${externalRpcUrl || 'Not Set'}` : ''}
CHAIN_ID: ${chainId}
LAYER: ${layer}
LOG_LEVEL: info`;

  if (!isGloballyEnabled && chainId) {
    return (
      <>
        <PageHeader title={chainDef ? `Details for ${chainDef.name}` : "Chain Details"} />
        <div className="content-page">
          <div className="card">
            <p>
              <strong>{chainDef?.name || 'This chain'} is not currently enabled.</strong>
            </p>
            <p>
              You can view its potential configuration options here, but to actively manage it,
              please enable it first via the "Manage Enabled Chains" screen.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/chains/enable')}>Manage Enabled Chains</button>
            <button className="btn btn-secondary" style={{marginLeft: '1rem'}} onClick={() => navigate('/chains')}>Back to Chain Management</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={`${name} (${layer}) - Details`} />
      <div className="content-page node-detail-page">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--padding-md)'}}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/chains')} >
            <i className="ri-arrow-left-s-line"></i> Back to Chain Management
          </button>
          {!isGloballyEnabled && (
            <span style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>Chain Not Enabled Globally</span>
          )}
        </div>

        <div className="card app-detail-header" style={{ alignItems: 'center', display: 'flex', gap: 'var(--padding-md)', marginBottom:'var(--padding-md)' }}>
          <i className={`${icon || 'ri-question-mark'} ri-4x`}></i>
          <div>
            <h2>{name} <span className="app-version-badge">{layer}</span></h2>
            <p className="app-category-detail">{description}</p>
            {blockExplorerUrl && <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link btn-sm" style={{paddingLeft:0}}><i className="ri-external-link-line"></i> Block Explorer</a>}
          </div>
        </div>

        <div className="card" style={{marginBottom:'var(--padding-md)'}}>
            <h3>Configuration & Status</h3>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                <strong>Enabled:</strong>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={isGloballyEnabled} 
                        readOnly
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            <div className="chain-config-area-detail" style={{marginTop:'0.5rem'}}>
                  {supportsLocalNode && availablePlugins && availablePlugins.length > 0 && (
                    <div className="config-choice" style={{ marginBottom: 'var(--padding-sm)', display:'flex', gap:'1rem', flexWrap: 'wrap'}}>
                        <label><input type="radio" name={`connType-${chainId}`} value="plugin" checked={connectionType === 'plugin'} onChange={() => handleSetConnectionType('plugin')} /> Use Local Plugin</label>
                        <label><input type="radio" name={`connType-${chainId}`} value="external" checked={connectionType === 'external'} onChange={() => handleSetConnectionType('external')} /> Use External RPC</label>
                    </div>
                  )}
                  {!supportsLocalNode && (
                     <p>This chain only supports External RPC connection.</p>
                  )}

                  {connectionType === 'plugin' && supportsLocalNode && availablePlugins && availablePlugins.length > 0 && (
                    <div className="plugin-config-detail" style={{padding: 'var(--padding-sm)', border: '1px solid var(--border-color-soft)', borderRadius: 'var(--border-radius)'}}>
                        {availablePlugins.length > 1 && (
                            <div style={{marginBottom: '0.5rem'}}>
                                <label htmlFor={`plugin-select-detail-${chainId}`} style={{marginRight: '0.5rem'}}>Select Plugin:</label>
                                <select 
                                    id={`plugin-select-detail-${chainId}`} 
                                    value={selectedPluginId || ''} 
                                    onChange={(e) => {
                                      const newPluginId = e.target.value;
                                      const newPluginDetails = availablePlugins.find(p => p.id === newPluginId);
                                      setChainConfig(prev => prev ? ({
                                        ...prev,
                                        selectedPluginId: newPluginId,
                                        pluginDetails: newPluginDetails,
                                        statusText: newPluginDetails?.installed ? (newPluginDetails.running ? `Running (${newPluginDetails.name})` : `Stopped (${newPluginDetails.name})`) : `Plugin selected: ${newPluginDetails?.name || 'Unknown'}`
                                      }) : prev);
                                    }}
                                    style={{padding: '0.3rem'}}
                                >
                                    {availablePlugins.map(p => <option key={p.id} value={p.id}>{p.name} (v{p.version})</option>)}
                                </select>
                            </div>
                        )}
                        {pluginDetails ? (
                            <>
                                <p><strong>Plugin:</strong> {pluginDetails.name} (v{pluginDetails.version}) - {pluginDetails.description}</p>
                                <p><strong>Status:</strong> {statusText}</p>
                                {!pluginDetails.installed && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handlePluginAction('install')} disabled={!isGloballyEnabled}>Install</button>
                                )}
                                {pluginDetails.installed && !pluginDetails.running && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handlePluginAction('start')} disabled={!isGloballyEnabled}>Start</button>
                                )}
                                {pluginDetails.installed && pluginDetails.running && (
                                    <button className="btn btn-danger btn-sm" onClick={() => handlePluginAction('stop')} disabled={!isGloballyEnabled}>Stop</button>
                                )}
                                {pluginDetails.installed && !pluginDetails.isCore && (
                                    <button className="btn btn-warning btn-sm" style={{marginLeft: '0.5rem'}} onClick={() => handlePluginAction('uninstall')} disabled={!isGloballyEnabled}>Uninstall</button>
                                )}
                            </>
                        ) : <p>No plugin selected or available for local node operation.</p>}
                    </div>
                  )}

                  {connectionType === 'external' && (
                        <div className="external-rpc-details" style={{borderTop: '1px solid var(--border-color)', paddingTop:'var(--padding-sm)', marginTop:'var(--padding-sm)'}}>
                            <h4>External RPC Configuration</h4>
                            {isEditingRpc ? (
                                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom:'0.5rem'}}>
                                    <input type="text" value={tempRpcUrl} onChange={(e) => setTempRpcUrl(e.target.value)} placeholder={defaultExternalRpcPlaceholder || "Enter RPC URL"} style={{flexGrow: 1, padding: '0.3rem'}} disabled={!isGloballyEnabled}/>
                                    <button className="btn btn-primary btn-sm" onClick={handleSaveRpc} disabled={!isGloballyEnabled}>Save</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingRpc(false)}>Cancel</button>
                                </div>
                            ) : (
                                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                                    <p style={{margin: 0}}><strong>RPC URL:</strong> {externalRpcUrl || <span style={{color: 'var(--text-color-muted)'}}>(Not Set)</span>}</p>
                                    <div>
                                      <button className="btn btn-secondary btn-sm" onClick={() => {setIsEditingRpc(true); setTempRpcUrl(externalRpcUrl || defaultExternalRpcPlaceholder || '');}} disabled={!isGloballyEnabled}>Edit</button>
                                      {externalRpcUrl && <button className="btn btn-secondary btn-sm" style={{marginLeft: '0.5rem'}} onClick={() => alert("Mock: Test Connection to " + externalRpcUrl)} disabled={!isGloballyEnabled}>Test</button>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                     {!supportsLocalNode && connectionType !== 'external' && isGloballyEnabled && (
                        <p style={{color: 'var(--warning-color)', marginTop:'0.5rem'}}>This chain only supports External RPC. Please configure an RPC URL to use it.</p>
                     )}
                </div>
        </div>
        
        {isGloballyEnabled && (
            <div className="card" style={{marginBottom:'var(--padding-md)'}}>
            <h4>Configuration Overview (Mock)</h4>
            <pre><code>{mockNodeConfigText}</code></pre>
            <Link to="/settings" className="btn btn-link btn-sm" style={{paddingLeft: 0, marginTop: '0.5rem'}}>Edit Global Network RPC Settings</Link>
            </div>
        )}

        {isGloballyEnabled && (connectionType === 'plugin' && pluginDetails || connectionType === 'external') && (
            <div className="card">
            <h4>Recent Log Snippet (Mock for {connectionType === 'plugin' && pluginDetails ? pluginDetails.name : name})</h4>
            <pre className="log-snippet-small" style={{maxHeight: '150px', overflowY: 'auto', backgroundColor: 'var(--background-color-dark)', padding: 'var(--padding-sm)', borderRadius: 'var(--border-radius-sm)'}}>
                <code>{logSnippet}</code>
            </pre>
            <Link to={`/logs/${logIdForPlugin}`} className="btn btn-secondary btn-sm" style={{marginTop: '0.5rem'}}>View Full Logs</Link>
            </div>
        )}

      </div>
    </>
  );
};

export default ChainDetailPage; 