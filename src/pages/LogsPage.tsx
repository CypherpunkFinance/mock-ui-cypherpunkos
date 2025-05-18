import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { mockLogs } from '../mockData'; // Assuming mockLogs is { [sourceId: string]: string }

const LogsPage: React.FC = () => {
  const { logSourceId: paramLogSourceId } = useParams<{ logSourceId?: string }>();
  
  const logSources = useMemo(() => Object.keys(mockLogs), []);
  const defaultLogSource = paramLogSourceId && logSources.includes(paramLogSourceId) ? paramLogSourceId : 'system';

  const [selectedLogSource, setSelectedLogSource] = useState<string>(defaultLogSource);
  const [filterText, setFilterText] = useState('');
  const [logLevel, setLogLevel] = useState('All Levels'); // Example, not fully implemented filtering by level

  useEffect(() => {
    // If the param changes and is valid, update the selected source
    if (paramLogSourceId && logSources.includes(paramLogSourceId)) {
      setSelectedLogSource(paramLogSourceId);
    }
    // Optionally, reset filters when param changes, or if paramLogSourceId is undefined, default to 'system'
    else if (!paramLogSourceId) {
        setSelectedLogSource('system');
    }
  }, [paramLogSourceId, logSources]);

  const currentLogs = useMemo(() => {
    const rawLogs = mockLogs[selectedLogSource] || `[INFO] No specific mock logs for ${selectedLogSource}.`;
    if (!filterText) {
      return rawLogs;
    }
    return rawLogs
      .split('\n')
      .filter(line => line.toLowerCase().includes(filterText.toLowerCase()))
      .join('\n');
    // Further filtering by logLevel could be added here
  }, [selectedLogSource, filterText, logLevel]);

  const handleClearDisplay = () => {
    // In a real app, this might clear a dynamic log buffer.
    // For mock, it doesn't do much as logs are static, but we can show an alert.
    alert('Mock: Log display cleared (no actual effect on static mock logs).');
  };

  const getLogSourceName = (sourceId: string): string => {
    // Create more readable names if needed, otherwise use sourceId
    const nameMap: { [key: string]: string } = {
        system: "CypherpunkOS System",
        nodeset: "Nodeset (L1)",
        "l2-base": "Base L2 Node",
        "l2-arbitrum": "Arbitrum L2 Node",
        "uniswap-interface": "Uniswap App",
        "aave-interface": "Aave App",
        "tornado-cash-interface": "Tornado Cash App",
        "cypherpunk-wallet": "Inbuilt Wallet"
    };
    return nameMap[sourceId] || sourceId;
  }

  return (
    <>
      <PageHeader title="Log Viewer" />
      <div className="content-page">
        <div className="card log-controls-mock" style={{ padding: 'var(--padding-md)', marginBottom: 'var(--padding-md)' }}>
          <label htmlFor="log-source-selector" style={{ marginRight: '0.5rem'}}>Log Source:</label>
          <select 
            id="log-source-selector" 
            className="input-mock" 
            value={selectedLogSource}
            onChange={(e) => setSelectedLogSource(e.target.value)}
            style={{ marginRight: '1rem' }}
          >
            {logSources.map(source => (
              <option key={source} value={source}>{getLogSourceName(source)}</option>
            ))}
          </select>

          <label htmlFor="log-filter-input" style={{ marginRight: '0.5rem'}}>Filter:</label>
          <input 
            type="text" 
            id="log-filter-input"
            placeholder="Filter logs..." 
            className="input-mock log-filter-input"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginRight: '1rem' }}
          />

          <label htmlFor="log-level-select" style={{ marginRight: '0.5rem'}}>Level:</label>
          <select 
            id="log-level-select" 
            className="input-mock log-level-select"
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            style={{ marginRight: '1rem' }}
          >
            <option>All Levels</option>
            <option>INFO</option>
            <option>WARN</option>
            <option>ERROR</option>
            <option>DEBUG</option> {/* Added DEBUG based on mockLogs */}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handleClearDisplay}>Clear Display</button>
        </div>

        <div className="card log-output-card">
          <pre id="log-content-mock" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
            {currentLogs}
          </pre>
        </div>
      </div>
    </>
  );
};

export default LogsPage; 