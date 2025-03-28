import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MembersList.css"; // Import your CSS file

const MembersList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/members")
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error("Error fetching members:", error);
      });
  }, []);

  return (
    <div className="members-container">
      <h2>Gym Members Details</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ol>
          {members.map(member => (
            <li key={member._id}>
              <h3>{member.name}</h3>
              <p>Membership: {member.membershipType}</p>
              <p>Email: {member.email}</p>
              <p>Phone: {member.phone}</p>
              <p>Status: {member.status}</p>
              <p>
                Joined: {member.joiningDate ? new Date(member.joiningDate).toDateString() : "N/A"}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default MembersList;
