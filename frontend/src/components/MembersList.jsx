import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./MembersList.css"; // Import your CSS file

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios.get("http://localhost:3000/api/members")
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error("Error fetching members:", error);
      });
  };

  // Delete Member Function
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/members/${id}`)
      .then(() => {
        setMembers(members.filter(member => member._id !== id)); // Remove from state
      })
      .catch(error => console.error("Error deleting member:", error));
  };

  // Navigate to Update Page
  const handleUpdate = (id) => {
    navigate(`/update/${id}`); // Redirects to update page
  };

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
              <button   className="update-button" onClick={() => handleUpdate(member._id)}>Update</button>
              <button onClick={() => handleDelete(member._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                Delete
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default MembersList;
