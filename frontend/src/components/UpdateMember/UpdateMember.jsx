import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnim from "../../assets/lottie/plane.json";
import "./UpdateMember.css";

const UpdateMember = () => {
  const [memberData, setMemberData] = useState({
    name: "",
    membershipType: "",
    email: "",
    phone: "",
    status: "",
    joiningDate: "",
    duration: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMemberData(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:3000/api/members/${id}`, memberData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/members");
        }, 2000);
      })
      .catch((err) => console.error("Update error:", err));
  };

  return (
    <div className="update-form-container">
      <h2 className="update-title">Update Member Details</h2>

      {showSuccess && (
        <div className="success-popup">
          <Lottie animationData={successAnim} loop={false} style={{ height: 120 }} />
          <p>Member updated successfully!</p>
        </div>
      )}

      <label>Full Name</label>
      <input
        type="text"
        name="name"
        value={memberData.name}
        onChange={handleInputChange}
        placeholder="Enter full name"
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={memberData.email}
        onChange={handleInputChange}
        placeholder="Enter email"
      />

      <label>Phone</label>
      <input
        type="text"
        name="phone"
        value={memberData.phone}
        onChange={handleInputChange}
        placeholder="Enter phone number"
      />

      <label>Membership Type</label>
      <select name="membershipType" value={memberData.membershipType} onChange={handleInputChange}>
        <option value="">Select Membership Type</option>
        <option value="Gold">Gold</option>
        <option value="Platinum">Platinum</option>
        <option value="Diamond">Diamond</option>
      </select>

      <label>Membership Duration</label>
      <select name="membershipDuration" value={memberData.membershipDuration} onChange={handleInputChange}>
      <option value="">Select Duration</option>
      <option value="30">1 month</option>
      <option value="90">3 months</option>
      <option value="180">6 months</option>
      <option value="365">1 year</option>
    </select>

      <label>Status</label>
      <select name="status" value={memberData.status} onChange={handleInputChange}>
        <option value="">Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="expired">Expired</option>
      </select>

      <label>Joining Date</label>
      <input
        type="date"
        name="joiningDate"
        value={memberData.joiningDate ? memberData.joiningDate.split("T")[0] : ""}
        onChange={handleInputChange}
      />

      <button onClick={handleUpdate}>Update Member</button>
    </div>
  );
};

export default UpdateMember;
