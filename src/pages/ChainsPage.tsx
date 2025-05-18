import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import RpcConfigModal from '../components/RpcConfigModal';
import {
  ALL_AVAILABLE_CHAINS,
  appStoreMockData, // To find plugin details
  findNodePlugin,   // Helper to get plugin AppDefinition
  getEnabledChainIds, // Import new helper
  getPluginsForChain, // Import new helper for multiple plugins
} from '../mockData';
import type { ChainDefinition, AppDefinition } from '../mockData';

// Defines the structure for how each chain's configuration is stored
interface ChainConfig {
  connectionType: 'plugin' | 'external' | 'none'; // 'none' if no specific config yet for an enabled chain
  externalRpcUrl?: string;
  // Status fields can be derived or explicitly set by user actions/system events
  statusText?: string; // e.g., "Running (Local Plugin)", "Connected (External RPC)", "Error", "Disabled"
  pluginDetails?: AppDefinition; // Details of the *selected* or default plugin
  availablePlugins?: AppDefinition[]; // All available plugins for this chain
  selectedPluginId?: string; // ID of the chosen plugin if multiple exist
}

// Map chainId to its configuration
type ConfiguredChainsState = Record<string, ChainConfig>;

const ChainsPage: React.FC = () => {
  const navigate = useNavigate();
  const [configuredChains, setConfiguredChains] = useState<ConfiguredChainsState>({});

  // Re-fetch and filter enabled chains when the component mounts or when returning from enable page (though no direct trigger here)
  // A more robust solution might involve a global state update listener or passing a refresh signal.
  const [enabledChainsToDisplay, setEnabledChainsToDisplay] = useState<ChainDefinition[]>([]);

  // State for RPC Config Modal
  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);
  const [configuringChain, setConfiguringChain] = useState<ChainDefinition | undefined>(undefined);

  useEffect(() => {
    const globallyEnabledIds = getEnabledChainIds();
    const chainsToDisplay = ALL_AVAILABLE_CHAINS.filter(chain => globallyEnabledIds.has(chain.id));
    setEnabledChainsToDisplay(chainsToDisplay);

    const initialConfigs: ConfiguredChainsState = {};
    chainsToDisplay.forEach(chain => {
      const availablePlugins = getPluginsForChain(chain.id, appStoreMockData);
      // Default to the first installed plugin, or the first available plugin, or undefined
      let currentSelectedPlugin = availablePlugins.find(p => p.installed) || availablePlugins[0];
      
      let connectionTypeByDefault: ChainConfig['connectionType'] = 'none';
      let statusTextByDefault = 'Ready to configure';
      let externalRpcUrlByDefault = chain.defaultExternalRpcPlaceholder || '';

      // Check appStoreMockData for an active configuration for this chain
      // An active configuration can be an external RPC or an installed plugin.
      const activeExternalConfig = appStoreMockData.find(app => 
        app.installed && 
        app.pluginForChainId === chain.id && 
        app.sourceType === 'external'
      );

      const activePluginConfig = currentSelectedPlugin && currentSelectedPlugin.installed ? 
        appStoreMockData.find(app => 
          app.id === currentSelectedPlugin!.id && 
          app.installed && 
          app.pluginForChainId === chain.id && 
          app.sourceType === 'plugin'
        ) : undefined;

      if (activeExternalConfig) {
        connectionTypeByDefault = 'external';
        externalRpcUrlByDefault = activeExternalConfig.rpcUrl || chain.defaultExternalRpcPlaceholder || '';
        statusTextByDefault = activeExternalConfig.running ? `Connected (External)` : (activeExternalConfig.hasError ? `Error (External)` : `Configured (External)`);
      } else if (activePluginConfig) { // activePluginConfig implies currentSelectedPlugin is defined and installed
        connectionTypeByDefault = 'plugin';
        statusTextByDefault = activePluginConfig.running ? `Running (${activePluginConfig.name})` : `Stopped (${activePluginConfig.name})`;
        if (activePluginConfig.hasError) statusTextByDefault = `Error (${activePluginConfig.name})`;
      } else {
        // No active configuration found, set defaults based on chain capabilities and available plugins
        if (chain.supportsLocalNode && availablePlugins.length > 0) {
          connectionTypeByDefault = 'plugin'; // Default to plugin interface if supported and plugins exist
          if (currentSelectedPlugin) { // A plugin is selected (might not be installed yet)
            statusTextByDefault = currentSelectedPlugin.installed ? 
              (currentSelectedPlugin.running ? `Running (${currentSelectedPlugin.name})` : `Stopped (${currentSelectedPlugin.name})`) :
              `Plugin available: ${currentSelectedPlugin.name}`;
            if (currentSelectedPlugin.hasError && currentSelectedPlugin.installed) statusTextByDefault = `Error (${currentSelectedPlugin.name})`;
          } else {
            statusTextByDefault = 'Plugin(s) available, select to configure.';
          }
        } else if (!chain.supportsLocalNode) {
          connectionTypeByDefault = 'external';
          statusTextByDefault = 'External RPC (Not Configured)';
        } else {
          // Supports local node but no plugins available, or other edge cases
          connectionTypeByDefault = 'none'; // Or 'external' if that's a more common fallback
          statusTextByDefault = 'Ready to configure';
        }
      }
      
      initialConfigs[chain.id] = {
        connectionType: connectionTypeByDefault,
        externalRpcUrl: externalRpcUrlByDefault,
        statusText: statusTextByDefault,
        pluginDetails: currentSelectedPlugin,
        availablePlugins: availablePlugins,
        selectedPluginId: currentSelectedPlugin?.id,
      };
    });
    setConfiguredChains(initialConfigs);
  }, []); // Removed navigate dependency as it caused loops, refresh on navigation can be handled differently if needed.

  const handleSetConnectionType = (chainId: string, type: 'plugin' | 'external') => {
    const chainDef = ALL_AVAILABLE_CHAINS.find(c => c.id === chainId);
    if (!chainDef) return;

    // Persist to appStoreMockData (simplified version)
    if (type === 'plugin') {
      appStoreMockData.forEach(app => {
        if (app.pluginForChainId === chainId && app.sourceType === 'external') app.installed = false;
      });
      const currentPlugin = configuredChains[chainId]?.pluginDetails;
      if (currentPlugin) {
        const pluginInStore = appStoreMockData.find(app => app.id === currentPlugin.id);
        if (pluginInStore) pluginInStore.installed = true;
      }
    } else { // external
        let externalConfig = appStoreMockData.find(app => 
            app.pluginForChainId === chainId && app.sourceType === 'external'
        );
        if (externalConfig) {
            externalConfig.installed = true;
        } else if (configuredChains[chainId]?.externalRpcUrl !== chainDef.defaultExternalRpcPlaceholder) {
             // If a custom URL is already set in state, ensure an entry exists or create one.
            // This part is better handled when saving RPC from modal.
        }
    }

    setConfiguredChains(prev => {
      const currentChainConfig = prev[chainId];
      let newStatusText = currentChainConfig.statusText;
      let rpcUrlToUse = currentChainConfig.externalRpcUrl;
      let newSelectedPluginId = currentChainConfig.selectedPluginId;
      let newPluginDetails = currentChainConfig.pluginDetails;

      if (type === 'plugin') {
        if (!newSelectedPluginId && currentChainConfig.availablePlugins && currentChainConfig.availablePlugins.length > 0) {
          newSelectedPluginId = currentChainConfig.availablePlugins[0].id;
          newPluginDetails = currentChainConfig.availablePlugins[0];
        }
        if (newPluginDetails) {
          newStatusText = newPluginDetails.installed ? (newPluginDetails.running ? `Running (${newPluginDetails.name})` : `Stopped (${newPluginDetails.name})`) : `Plugin available: ${newPluginDetails.name}`;
        } else {
          newStatusText = 'No plugin selected/available';
        }
      } else if (type === 'external') {
        if (!rpcUrlToUse && chainDef?.defaultExternalRpcPlaceholder) {
            rpcUrlToUse = chainDef.defaultExternalRpcPlaceholder;
        }
        newStatusText = rpcUrlToUse && rpcUrlToUse !== chainDef?.defaultExternalRpcPlaceholder ? `External RPC (Configured)` : `External RPC (Default)`;
        if (!rpcUrlToUse || rpcUrlToUse === chainDef?.defaultExternalRpcPlaceholder) newStatusText = 'External RPC (Not Configured)';
      }
      
      return {
        ...prev,
        [chainId]: {
          ...currentChainConfig,
          connectionType: type,
          statusText: newStatusText,
          externalRpcUrl: rpcUrlToUse,
          selectedPluginId: newSelectedPluginId,
          pluginDetails: newPluginDetails,
        }
      };
    });
  };

  const handleSelectPlugin = (chainId: string, pluginId: string) => {
    setConfiguredChains(prev => {
      const currentConfig = prev[chainId];
      const selectedPlugin = currentConfig.availablePlugins?.find(p => p.id === pluginId);
      if (!selectedPlugin) return prev;
      return {
        ...prev,
        [chainId]: {
          ...currentConfig,
          selectedPluginId: pluginId,
          pluginDetails: selectedPlugin,
          statusText: selectedPlugin.installed ? (selectedPlugin.running ? `Running (${selectedPlugin.name})` : `Stopped (${selectedPlugin.name})`) : `Plugin selected: ${selectedPlugin.name}`,
        }
      }
    });
  };

  const handleOpenRpcModal = (chain: ChainDefinition) => {
    setConfiguringChain(chain);
    setIsRpcModalOpen(true);
  };

  const handleSaveRpcFromModal = (newRpcUrl: string) => {
    if (!configuringChain) return;
    const chainId = configuringChain.id;

    // Update appStoreMockData
    let externalConfig = appStoreMockData.find(app => 
      app.pluginForChainId === chainId && app.sourceType === 'external'
    );
    if (externalConfig) {
      externalConfig.rpcUrl = newRpcUrl;
      externalConfig.installed = true; // Mark as active config
      // Potentially update running/error status if we could test it
    } else {
      // Create new if doesn't exist
      appStoreMockData.push({
        id: `${chainId}-external-custom-${Date.now()}`,
        name: configuringChain.name,
        subName: 'External RPC',
        icon: configuringChain.icon,
        mainCategory: "Chain",
        category: `${configuringChain.layer} Node`,
        description: `Custom external RPC for ${configuringChain.name}`,
        long_description: `Custom external RPC for ${configuringChain.name}`,
        version: "N/A",
        developer: "User Configured",
        installed: true,
        running: false, 
        hasError: false,
        isNode: true,
        sourceType: "external",
        rpcUrl: newRpcUrl,
        pluginForChainId: chainId,
      });
    }

    // Update local state for ChainsPage
    setConfiguredChains(prev => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        externalRpcUrl: newRpcUrl,
        statusText: newRpcUrl ? (newRpcUrl !== configuringChain.defaultExternalRpcPlaceholder ? `External RPC (Configured)`: `External RPC (Default)`) : `External RPC (Not Set)`,
        connectionType: 'external', // Ensure connection type is external
      }
    }));
    setIsRpcModalOpen(false);
    setConfiguringChain(undefined);
  };
  
  const handlePluginAction = (chainId: string, action: 'install' | 'uninstall' | 'start' | 'stop') => {
    const chainConfig = configuredChains[chainId];
    const plugin = chainConfig.pluginDetails; // Actions are on the currently selected plugin
    if (!plugin) return;

    alert(`Mock action: ${action} plugin ${plugin.name} for ${ALL_AVAILABLE_CHAINS.find(c=>c.id === chainId)?.name}`);
    
    setConfiguredChains(prev => {
      const targetConfig = prev[chainId];
      if (!targetConfig || !targetConfig.pluginDetails || targetConfig.pluginDetails.id !== plugin.id) return prev; // Ensure config and plugin match

      const newPluginDetails = { ...targetConfig.pluginDetails };
      let newStatus = targetConfig.statusText;

      // Also update appStoreMockData for plugin state
      const pluginInStore = appStoreMockData.find(app => app.id === newPluginDetails.id);

      if (action === 'install') {
        newPluginDetails.installed = true;
        if(pluginInStore) pluginInStore.installed = true;
      }
      if (action === 'uninstall') { 
        newPluginDetails.installed = false; newPluginDetails.running = false; 
        if(pluginInStore) { pluginInStore.installed = false; pluginInStore.running = false; }
      }
      if (action === 'start') {
        newPluginDetails.running = true; newPluginDetails.hasError = false;
        if(pluginInStore) { pluginInStore.running = true; pluginInStore.hasError = false; pluginInStore.installed = true; }
      }
      if (action === 'stop') {
        newPluginDetails.running = false;
        if(pluginInStore) pluginInStore.running = false;
      }
      
      if (newPluginDetails.installed) {
        newStatus = newPluginDetails.running ? `Running (${newPluginDetails.name})` : `Stopped (${newPluginDetails.name})`;
        if (newPluginDetails.hasError) newStatus = `Error (${newPluginDetails.name})`;
      } else {
        newStatus = `Plugin available: ${newPluginDetails.name}`;
      }

      return {
        ...prev,
        [chainId]: {
          ...targetConfig,
          pluginDetails: newPluginDetails,
          statusText: newStatus,
        }
      };
    });
  };

  if (Object.keys(configuredChains).length === 0 && enabledChainsToDisplay.length > 0) {
    // Still initializing configs for enabled chains
    return <><PageHeader title="Chain Management" /><div className="content-page"><p>Loading chain configurations...</p></div></>;
  }

  return (
    <>
      <PageHeader title="Chain Management" />
      <div className="content-page">
        <div style={{display: 'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 'var(--padding-md)'}}>
            <p>
            Configure your enabled blockchain network connections below.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/chains/enable')}>
                <i className="ri-add-circle-line"></i> Manage Enabled Chains
            </button>
        </div>

        {enabledChainsToDisplay.length === 0 && (
            <div className="card">
                <p>No chains are currently enabled. Click "Manage Enabled Chains" to add and activate networks.</p>
            </div>
        )}

        <div className="chains-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--padding-md)'}}>
          {enabledChainsToDisplay.map((chain) => {
            const config = configuredChains[chain.id];
            if (!config) return <div key={chain.id} className="card"><p>Loading configuration for {chain.name}...</p></div>;

            const currentPlugin = config.pluginDetails; // This is the selected plugin

            return (
              <div className="card chain-card" key={chain.id}>
                <div className="chain-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-sm)'}}>
                    <i className={`${chain.icon || 'ri-question-mark'} ri-2x`}></i>
                    <h3>{chain.name} <span style={{fontSize: '0.8em', color: 'var(--text-color-muted)'}}>({chain.layer})</span></h3>
                  </div>
                </div>
                <p style={{fontSize: '0.9em', color: 'var(--text-color-muted)', marginTop: 0, marginBottom: '0.5rem'}}>{chain.description}</p>
                
                <div className="chain-config-area" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--padding-sm)', marginTop: 'var(--padding-sm)'}}>
                  <div className="config-choice" style={{ marginBottom: 'var(--padding-sm)'}}>
                    {chain.supportsLocalNode && (
                        <label style={{marginRight: 'var(--padding-sm)'}}>
                        <input type="radio" name={`connType-${chain.id}`} value="plugin" checked={config.connectionType === 'plugin'} onChange={() => handleSetConnectionType(chain.id, 'plugin')}/> Use Local Plugin
                        </label>
                    )}
                    <label>
                        <input type="radio" name={`connType-${chain.id}`} value="external" checked={config.connectionType === 'external'} onChange={() => handleSetConnectionType(chain.id, 'external')} /> Use External RPC
                    </label>
                  </div>

                  {config.connectionType === 'plugin' && (
                    <div className="plugin-config">
                        {config.availablePlugins && config.availablePlugins.length > 1 && (
                            <div style={{marginBottom: '0.5rem'}}>
                                <label htmlFor={`plugin-select-${chain.id}`} style={{marginRight: '0.5rem'}}>Select Plugin:</label>
                                <select 
                                    id={`plugin-select-${chain.id}`} 
                                    value={config.selectedPluginId || ''} 
                                    onChange={(e) => handleSelectPlugin(chain.id, e.target.value)}
                                    style={{padding: '0.3rem'}}
                                >
                                    {config.availablePlugins.map(p => <option key={p.id} value={p.id}>{p.name} (v{p.version})</option>)}
                                </select>
                            </div>
                        )}
                        {currentPlugin ? (
                            <>
                                <p><strong>Plugin:</strong> {currentPlugin.name} (v{currentPlugin.version})</p>
                                <p><strong>Status:</strong> {config.statusText}</p>
                                {!currentPlugin.installed && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handlePluginAction(chain.id, 'install')}>Install Plugin</button>
                                )}
                                {currentPlugin.installed && !currentPlugin.running && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handlePluginAction(chain.id, 'start')}>Start Plugin</button>
                                )}
                                {currentPlugin.installed && currentPlugin.running && (
                                    <button className="btn btn-danger btn-sm" onClick={() => handlePluginAction(chain.id, 'stop')}>Stop Plugin</button>
                                )}
                                {currentPlugin.installed && !currentPlugin.isCore && (
                                    <button className="btn btn-warning btn-sm" style={{marginLeft: '0.5rem'}} onClick={() => handlePluginAction(chain.id, 'uninstall')}>Uninstall</button>
                                )}
                                {currentPlugin.installed && <button className="btn btn-secondary btn-sm" style={{marginLeft: '0.5rem'}} onClick={() => navigate(`/logs/${currentPlugin.id}`)}>View Logs</button>}
                            </>
                        ) : <p>No suitable plugin selected or available for this chain.</p>}
                    </div>
                  )}

                  {config.connectionType === 'external' && (
                    <div className="external-rpc-config">
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                          <p style={{margin: 0}}>
                            <strong>RPC URL:</strong> {config.externalRpcUrl || <span style={{color: 'var(--text-color-muted)'}}>(Not Set)</span>}
                          </p>
                          <div>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenRpcModal(chain)}>Configure RPC</button>
                            {config.externalRpcUrl && config.externalRpcUrl !== chain.defaultExternalRpcPlaceholder && 
                                <button className="btn btn-secondary btn-sm" style={{marginLeft: '0.5rem'}} onClick={() => alert("Mock: Test Connection to " + config.externalRpcUrl)}>Test</button>}
                          </div>
                        </div>
                      <p><strong>Status:</strong> {config.statusText}</p>
                    </div>
                  )}
                  {!chain.supportsLocalNode && config.connectionType !== 'external' && (
                      <p style={{color: 'var(--warning-color)', marginTop: '0.5rem'}}>This chain only supports External RPC. Please configure an RPC URL.</p>
                  )}

                  <div className="chain-actions" style={{marginTop: 'var(--padding-sm)'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/chain-detail/${chain.id}`)}>View Details & Advanced Config</button>
                    {chain.blockExplorerUrl && (
                      <a href={chain.blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link btn-sm" style={{marginLeft: '0.5rem'}}>
                        <i className="ri-external-link-line"></i> Block Explorer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* RPC Config Modal */} 
      <RpcConfigModal 
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        chain={configuringChain}
        currentRpcUrl={configuringChain && configuredChains[configuringChain.id]?.externalRpcUrl ? configuredChains[configuringChain.id].externalRpcUrl! : (configuringChain?.defaultExternalRpcPlaceholder || '')}
        onSave={handleSaveRpcFromModal}
      />
    </>
  );
};

export default ChainsPage; 