import React, { useState, useEffect } from 'react';
import './ScoreAlert.css';

interface ScoreAlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const ScoreAlert: React.FC<ScoreAlertProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  // State to handle animation
  const [isActive, setIsActive] = useState(false);
  
  // Handle alert visibility and animation
  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      
      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        // Allow time for fade-out animation
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  // Handle clicks and touches to dismiss the alert
  const handleDismiss = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActive(false);
    
    // Call onClose after animation completes
    setTimeout(onClose, 300);
  };

  if (!isVisible && !isActive) {
    return null;
  }
  
  return (
    <div 
      className={`score-alert ${isActive ? 'active' : ''}`} 
      onClick={handleDismiss}
      onTouchEnd={handleDismiss}
    >
      <div className="score-alert-content">
        <span className="score-alert-message">{message}</span>
      </div>
    </div>
  );
};

export default ScoreAlert;
