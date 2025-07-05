import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MembersList.css";
import api from "../../axiosConfig"; // Ensure correct path

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      console.log("Fetching members..."); // Debug
      const res = await api.get("/members/all");
      console.log("API Response:", res.data); // Debug
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching all members:", err);
      setError("Failed to load members");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // Using the configured api
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    }
  };

  const handleFilterChange = async (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);

    try {
      if (selectedUserId === "") {
        fetchAllMembers();
      } else {
        const res = await api.get(`/members/by-user/${selectedUserId}`);
        setMembers(res.data);
      }
    } catch (error) {
      console.error("Error filtering members:", error);
      setError("Failed to filter members");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((member) => member._id !== id));
    } catch (error) {
      console.error("Error deleting member:", error);
      setError("Failed to delete member");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  return (
    <div className="members-pro-container">
      <div className="members-header">
        <h2>Member Directory</h2>
        <p>View and manage all your gym members</p>

        <select
          value={selectedUser}
          onChange={handleFilterChange}
          className="user-filter-dropdown"
        >
          <option value="">-- All Members --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="members-table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id}>
                  <td>
                    <div className="member-info">
                      <div className="avatar-placeholder">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div>
                        <strong>{member.name}</strong>
                        <div className="email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{member.membershipType}</td>
                  <td>
                    <span
                      className={`status-badge ${member.status.toLowerCase()}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>{new Date(member.joiningDate).toLocaleDateString()}</td>
                  <td>{member.membershipDuration ? `${member.membershipDuration} days`: "N/A"}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleUpdate(member._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(member._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;