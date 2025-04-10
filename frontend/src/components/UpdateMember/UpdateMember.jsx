import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateMember.css";

const UpdateMember = () => {
  const [memberData, setMemberData] = useState({
    name: "",
    membershipType: "",
    email: "",
    phone: "",
    status: "",
    joiningDate: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setMemberData(response.data))
      .catch((error) => console.error("Error fetching member data:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData({
      ...memberData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:3000/api/members/${id}`, memberData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/members");
        }, 2000);
      })
      .catch((error) => console.error("Error updating member:", error));
  };

  return (
    <div className="update-form-container">
      <h2 className="update-title">🏋️‍♂️ Update Gym Member</h2>

      {showSuccess && (
        <div className="success-popup">✅ Member updated successfully!</div>
      )}

      <label>
        📛 Name:
        <input
          type="text"
          name="name"
          value={memberData.name}
          onChange={handleInputChange}
          placeholder="Enter full name"
        />
      </label>

      <label>
        📧 Email:
        <input
          type="email"
          name="email"
          value={memberData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
        />
      </label>

      <label>
        📞 Phone:
        <input
          type="text"
          name="phone"
          value={memberData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </label>

      <label>
        🏋️ Membership Type:
        <select
          name="membershipType"
          value={memberData.membershipType}
          onChange={handleInputChange}
        >
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Diamond">Diamond</option>
        </select>
      </label>

      <label>
        📌 Status:
        <select
          name="status"
          value={memberData.status}
          onChange={handleInputChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>

      <label>
        📅 Joining Date:
        <input
          type="date"
          name="joiningDate"
          value={memberData.joiningDate}
          onChange={handleInputChange}
        />
      </label>

      <button onClick={handleUpdate}>Update Member</button>
    </div>
  );
};

export default UpdateMember;
