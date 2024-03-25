import React from "react";
// import Avatar from "react-avatar";
// import AvatarEditor from 'react-avatar-editor'
import Avatar, { genConfig } from "react-nice-avatar";

const Client = ({ user }) => {
  const config = genConfig();
  return (
    <div className="client">
    <Avatar style={{ width: "3rem", height: "3rem" }} />
      <span className="username">{user}</span>
    </div>
  );
};
export default Client;
