import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MembersList.css";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios
      .get("http://localhost:3000/api/members")
      .then((response) => setMembers(response.data))
      .catch((error) => console.error("Error fetching members:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/members/${id}`)
      .then(() => {
        setMembers(members.filter((member) => member._id !== id));
      })
      .catch((error) => console.error("Error deleting member:", error));
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  return (
    <div className="members-pro-container">
      <div className="members-header">
        <h2>Member Directory</h2>
        <p>View and manage all your gym members</p>
      </div>
      <div className="members-table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Last Check-in</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>
                  <div className="member-info">
                    <div className="avatar-placeholder">{member.name[0]}</div>
                    <div>
                      <strong>{member.name}</strong>
                      <div className="email">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td>{member.membershipType}</td>
                <td>
                  <span className={`status-badge ${member.status.toLowerCase()}`}>
                    {member.status}
                  </span>
                </td>
                <td>{new Date(member.joiningDate).toLocaleDateString()}</td>
                <td>{member.lastCheckin || "Not checked in yet"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleUpdate(member._id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(member._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;
