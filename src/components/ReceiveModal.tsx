import React from 'react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  receiveAddress: string;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, accountName, receiveAddress }) => {
  if (!isOpen) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(receiveAddress).then(() => {
      alert('Address copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy: ' + err);
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Receive Funds</h2>
        <p><strong>Account:</strong> {accountName}</p>
        <p>Your Address:</p>
        <div className="receive-address-display">
          <code style={{wordBreak: 'break-all'}}>{receiveAddress}</code>
          <button onClick={copyAddress} className="btn btn-sm btn-secondary" style={{marginLeft: '10px'}}><i className="ri-clipboard-line"></i> Copy</button>
        </div>
        <p style={{marginTop: '1rem'}}>Show this QR code or address to the sender.</p>
        {/* Placeholder for QR Code - we can add a library for this later */}
        <div className="qr-code-placeholder card" style={{width: '150px', height: '150px', margin: '1rem auto', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          [QR Code]
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal; 