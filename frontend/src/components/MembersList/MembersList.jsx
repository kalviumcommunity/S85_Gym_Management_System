import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MembersList.css";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/members/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching all members:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleFilterChange = async (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);

    try {
      const token = localStorage.getItem("token");

      if (selectedUserId === "") {
        fetchAllMembers();
      } else {
        const res = await axios.get(
          `http://localhost:3000/api/members/by-user/${selectedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembers(res.data);
      }
    } catch (error) {
      console.error("Error filtering members:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((prev) => prev.filter((member) => member._id !== id));
    } catch (error) {
      console.error("Error deleting member:", error);
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
