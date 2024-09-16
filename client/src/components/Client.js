import React from "react";
import Avatar from "react-nice-avatar";

const Client = ({ user, isActive }) => {
  return (
    <div className={`client-container ${isActive ? 'active' : ''}`}>
      <Avatar 
        style={{ 
          width: "3rem", 
          height: "3rem",
          border: isActive ? "6px solid #4285F4" : "none",
          boxShadow: isActive ? "0 0 10px 2px #4285F4" : "none",
          transition: "all 0.2s ease-in-out" // Smooth transition for the effect
        }} 
      />
      <span className="username">{user}</span>
    </div>
  );
};

export default Client;