import React from "react";
import Avatar from "react-nice-avatar";

const Client = ({ user, isActive }) => {
  return (
    <div className={`client-container ${isActive ? 'active' : ''}`}>
      <Avatar 
        style={{ 
          width: "3rem", 
          height: "3rem", 
          border: isActive ? "6px solid #4ee44e" : "none", // Conditional border 
          boxShadow: isActive ? "0 0 10px 5px #4ee44e" : "none" // Glowing effect 
        }} 
      />
      <span className="username">{user}</span>
    </div>
  );
};

export default Client;