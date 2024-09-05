import React from 'react';
import './TypingIndicator.css'; // We'll create this CSS file

const TypingIndicator = ({ activeUser }) => {
  if (!activeUser) return null;

  return (
    <div className="typing-indicator">
      <span className="typing-text">{activeUser} is typing</span>
      <div className="typing-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;