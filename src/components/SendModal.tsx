import React from 'react';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromAddress: string;
  networkName: string;
  // Add other props as needed, e.g., for handling the send logic
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, fromAddress, networkName }) => {
  if (!isOpen) return null;

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for actual send logic
    alert(`Mock: Sending from ${fromAddress} on ${networkName}. Details in form.`);
    onClose(); // Close modal after mock send
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Send Tokens/ETH</h2>
        <p>From: {fromAddress} on {networkName}</p>
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label htmlFor="recipientAddress">Recipient Address:</label>
            <input type="text" id="recipientAddress" className="input-mock" placeholder="0x..." required />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" className="input-mock" placeholder="0.0" required />
          </div>
          <div className="form-group">
            <label htmlFor="asset">Asset:</label>
            <select id="asset" className="input-mock">
              <option value="ETH">ETH</option>
              {/* Add other tokens based on selected account later */}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Send</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendModal; 