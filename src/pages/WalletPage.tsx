import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SendModal from '../components/SendModal';
import ReceiveModal from '../components/ReceiveModal';

// Mock data for accounts (can be expanded or moved to mockData.ts later)
const mockAccounts = [
  {
    id: 'acc1',
    name: 'Account 1 (Main Base Account)',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    shortAddress: '0x123...5678',
    balance: '1.25 ETH',
    tokens: [
      { name: 'CYPH', symbol: 'CYPH', balance: '1000.00' },
      { name: 'USD Coin', symbol: 'USDC', balance: '500.75' },
    ],
  },
  {
    id: 'acc2',
    name: 'Account 2 (Degen Stuff)',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    shortAddress: '0xabc...ef12',
    balance: '0.05 ETH',
    tokens: [],
  },
];

// Mock transaction history
const mockTxHistory = [
  { type: 'out', details: 'Sent 0.1 ETH to 0xabc...', status: 'Confirmed', statusClass: 'success', time: '2 hours ago' },
  { type: 'in', details: 'Received 500 USDC from 0xdef...', status: 'Pending', statusClass: 'pending', time: '15 mins ago' },
  { type: 'out', details: 'Sent 0.002 ETH to 0x789...', status: 'Failed', statusClass: 'failed', time: '1 day ago' },
];

const WalletPage: React.FC = () => {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedAccountForSend, setSelectedAccountForSend] = useState(mockAccounts[0]);
  const [selectedAccountForReceive, setSelectedAccountForReceive] = useState(mockAccounts[0]);
  const [selectedNetwork, setSelectedNetwork] = useState('Base Mainnet (External RPC: my-base-rpc.com)');

  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const networkName = event.target.options[event.target.selectedIndex].text;
    setSelectedNetwork(networkName);
    alert(`Mock: Wallet switched to ${networkName}. Balances and TX history would refresh.`);
  };

  const openSendModal = (account: typeof mockAccounts[0]) => {
    setSelectedAccountForSend(account);
    setIsSendModalOpen(true);
  };

  const openReceiveModal = (account: typeof mockAccounts[0]) => {
    setSelectedAccountForReceive(account);
    setIsReceiveModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Address copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy address: ' + err);
    });
  };

  return (
    <>
      <PageHeader title="Inbuilt Wallet" />
      <div className="content-page">
        <div className="card">
          <div className="wallet-header">
            <h3><i className="ri-wallet-3-fill"></i> Wallet Overview</h3>
            <div className="wallet-controls">
              <label htmlFor="wallet-network-switcher">Network:</label>
              <select id="wallet-network-switcher" className="input-mock" onChange={handleNetworkChange} defaultValue="base_mainnet">
                <option value="ethereum_l1">Ethereum Mainnet (Local Nodeset)</option>
                <option value="base_mainnet">Base Mainnet (External RPC: my-base-rpc.com)</option>
                <option value="arbitrum_one" disabled>Arbitrum One (Not Configured)</option>
              </select>
            </div>
          </div>

          <div className="accounts-section">
            <div className="account-actions">
              <button className="btn btn-primary btn-sm"><i className="ri-add-circle-line"></i> Create Account</button>
              <button className="btn btn-secondary btn-sm"><i className="ri-download-2-line"></i> Import Account</button>
              <Link to="/settings" className="btn btn-secondary btn-sm"><i className="ri-settings-3-line"></i> Wallet Settings</Link>
            </div>

            {mockAccounts.map(account => (
              <div className="account-details card" key={account.id}>
                <div className="account-header">
                  <h5>{account.name}</h5>
                  <span className="account-address" title={account.address}>
                    <code>{account.shortAddress}</code>
                    <i className="ri-clipboard-line copy-btn" onClick={() => copyToClipboard(account.address)} style={{cursor: 'pointer'}}></i>
                  </span>
                </div>
                <p><strong>Balance:</strong> {account.balance}</p>
                {account.tokens.length > 0 && (
                  <>
                    <p><strong>Tokens:</strong></p>
                    <ul className="token-list">
                      {account.tokens.map(token => (
                        <li key={token.symbol}>{token.name} ({token.symbol}): {token.balance}</li>
                      ))}
                      <li><button className="btn btn-link btn-sm">+ Add Token</button></li>
                    </ul>
                  </>
                )}
                <div className="account-buttons">
                  <button className="btn btn-primary btn-sm" onClick={() => openSendModal(account)}><i className="ri-send-plane-line"></i> Send</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openReceiveModal(account)}><i className="ri-qr-code-line"></i> Receive</button>
                </div>
              </div>
            ))}
          </div>

          <div className="transaction-history-section">
            <h3>Transaction History (Mock for <span id="wallet-tx-network-name">{selectedNetwork}</span>)</h3>
            <ul className="tx-history">
              {mockTxHistory.map((tx, index) => (
                <li key={index}>
                  <span className={`tx-type ${tx.type}`}>{tx.type === 'in' ? 'Received' : 'Sent'}</span> {tx.details}
                  <span className={`tx-status ${tx.statusClass}`}>{tx.status}</span>
                  <small style={{marginLeft: '0.5em'}}>{tx.time}</small>
                  <a href="#" className="tx-link" target="_blank" title="View on explorer"><i className="ri-external-link-line"></i></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SendModal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)} 
        fromAddress={selectedAccountForSend.shortAddress}
        networkName={selectedNetwork}
      />
      <ReceiveModal 
        isOpen={isReceiveModalOpen} 
        onClose={() => setIsReceiveModalOpen(false)} 
        accountName={selectedAccountForReceive.name} 
        receiveAddress={selectedAccountForReceive.address} 
      />
    </>
  );
};

export default WalletPage; 