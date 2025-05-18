import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { ALL_AVAILABLE_CHAINS, getEnabledChainIds, setEnabledChainIds } from '../mockData';
import type { ChainDefinition } from '../mockData';
import '../style.css'; // Assuming some base styles might be needed for buttons/layout

const EnableChainsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChainIds, setSelectedChainIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize selection from global state
    setSelectedChainIds(getEnabledChainIds());
  }, []);

  const handleCheckboxChange = (chainId: string, checked: boolean) => {
    setSelectedChainIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(chainId);
      } else {
        newSet.delete(chainId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    setEnabledChainIds(selectedChainIds);
    navigate('/chains');
  };

  const handleCancel = () => {
    navigate('/chains');
  };

  return (
    <>
      <PageHeader title="Enable / Disable Chains" />
      <div className="content-page enable-chains-page">
        <p style={{marginBottom: 'var(--padding-lg)'}}>
          Select the blockchain networks you want to activate and manage within CypherpunkOS. 
          Only enabled chains will appear on the main "Chains" page for configuration.
        </p>

        <div className="chains-selection-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--padding-sm)'}}>
          {ALL_AVAILABLE_CHAINS.map((chain: ChainDefinition) => (
            <div 
              key={chain.id} 
              className="card chain-selection-item" 
              style={{
                padding: 'var(--padding-md)',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                // Slightly change background if selected for visual feedback
                backgroundColor: selectedChainIds.has(chain.id) ? 'var(--background-color-light-accent)' : 'var(--background-color-card)',
                cursor: 'pointer'
              }}
              onClick={() => handleCheckboxChange(chain.id, !selectedChainIds.has(chain.id))} // Allow clicking whole card
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-md)'}}>
                <i className={`${chain.icon || 'ri-question-mark'} ri-2x`} style={{color: 'var(--primary-color)'}}></i>
                <div>
                  <h4 style={{margin: '0 0 0.25rem 0'}}>{chain.name} <span style={{fontSize: '0.8em', color: 'var(--text-color-muted)'}}>({chain.layer})</span></h4>
                  <p style={{fontSize: '0.85em', color: 'var(--text-color-muted)', margin:0}}>{chain.description}</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={selectedChainIds.has(chain.id)}
                onChange={(e) => handleCheckboxChange(chain.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()} // Prevent card click from double-toggling
                style={{ transform: 'scale(1.5)', cursor: 'pointer'}} // Larger checkbox
              />
            </div>
          ))}
        </div>

        <div className="form-actions" style={{marginTop: 'var(--padding-lg)', display: 'flex', gap: 'var(--padding-md)'}}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default EnableChainsPage; 