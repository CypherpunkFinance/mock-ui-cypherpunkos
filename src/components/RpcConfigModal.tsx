import React, { useState, useEffect } from 'react';
import type { ChainDefinition } from '../mockData'; // Assuming ChainDefinition might be useful for context
import '../style.css'; // For modal styling if not handled by a global sheet

interface RpcConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  chain: ChainDefinition | undefined; // The chain being configured
  currentRpcUrl: string;
  onSave: (newRpcUrl: string) => void;
}

const RpcConfigModal: React.FC<RpcConfigModalProps> = ({
  isOpen,
  onClose,
  chain,
  currentRpcUrl,
  onSave,
}) => {
  const [rpcUrl, setRpcUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRpcUrl(currentRpcUrl || chain?.defaultExternalRpcPlaceholder || '');
    }
  }, [isOpen, currentRpcUrl, chain]);

  if (!isOpen || !chain) {
    return null;
  }

  const handleSave = () => {
    onSave(rpcUrl);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Configure External RPC for {chain.name}</h3>
          <button onClick={onClose} className="btn-close-modal">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <div className="modal-body">
          <p>Enter the RPC URL for the {chain.name} ({chain.layer}) network.</p>
          <div className="form-group" style={{marginBottom: 'var(--padding-md)'}}>
            <label htmlFor={`rpc-url-modal-${chain.id}`}>RPC URL:</label>
            <input
              type="text"
              id={`rpc-url-modal-${chain.id}`}
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder={chain.defaultExternalRpcPlaceholder || 'https://your-rpc-provider.com'}
              style={{ width: '100%', padding: 'var(--input-padding-sm)' }}
            />
          </div>
          {/* Optional: Add a test button here later if needed */}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{marginLeft: 'var(--padding-sm)'}}>
            Save RPC URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default RpcConfigModal; 