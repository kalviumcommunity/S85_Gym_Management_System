import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateMember.css"; // Import the new CSS file

const UpdateMember = () => {
  const [memberData, setMemberData] = useState({
    name: "",
    membershipType: "",
    email: "",
    phone: "",
    status: "",
    joiningDate: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/members/${id}`)
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
    axios
      .put(`http://localhost:3000/api/members/${id}`, memberData)
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Error updating member:", error));
  };

  return (
    <div className="update-form-container">
      <h2>Update Member</h2>
      <input
        type="text"
        name="name"
        value={memberData.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={memberData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="phone"
        value={memberData.phone}
        onChange={handleInputChange}
        placeholder="Phone"
      />
      <select
        name="membershipType"
        value={memberData.membershipType}
        onChange={handleInputChange}
      >
        <option value="Gold">Gold</option>
        <option value="Platinum">Platinum</option>
        <option value="Diamond">Diamond</option>
      </select>
      <select
        name="status"
        value={memberData.status}
        onChange={handleInputChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input
        type="date"
        name="joiningDate"
        value={memberData.joiningDate}
        onChange={handleInputChange}
      />
      <button onClick={handleUpdate}>Update Member</button>
    </div>
  );
};

export default UpdateMember;
