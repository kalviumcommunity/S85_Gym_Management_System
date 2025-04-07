import React from "react";
import "./GymCard.css"; // Import styles

const GymCard = ({ name, membershipType, status, joiningDate }) => {
  return (
    <div className="gym-card">
      <h2>{name}</h2>
      <p><strong>Membership:</strong> {membershipType}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Joined:</strong> {joiningDate}</p>
    </div>
  );
};

export default GymCard;
