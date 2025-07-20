import React from 'react';
import './AboutModal.css';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://alpiepho.github.io/scoreboard_tn3/#/')}`;

  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="about-modal-header">
          <h2>About ScoresTN3</h2>
          <button className="about-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="about-modal-body">
          <p>Scan this QR code to access the app:</p>
          <div className="qr-code-container">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for ScoresTN3" 
              className="qr-code"
            />
          </div>
          
          <div className="about-links">
            <p>
              <a 
                href="https://alpiepho.github.io/scoreboard_tn3/#/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                https://alpiepho.github.io/scoreboard_tn3/#/
              </a>
            </p>
            
            <p>
              <a 
                href="https://github.com/alpiepho/scoreboard_tn3" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                https://github.com/alpiepho/scoreboard_tn3
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
