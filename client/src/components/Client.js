import React from "react";
import Avatar from "react-nice-avatar";

const Client = ({ user, isActive }) => {
  return (
    <div className={`${isActive ? 'active' : ''}`}>
      <Avatar 
        style={{ 
          width: "3rem", 
          height: "3rem", 
          border: isActive ? "6px solid #4ee44e" : "none" // Conditional border 
        }} 
      />
      <span className="username">{user}</span>
    </div>
  );
};

export default Client;
