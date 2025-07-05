import React, { useState } from "react";
import "./AddMember.css";
import Lottie from "lottie-react";
import successAnimation from "../../assets/success.json/Animation - 1744280050642.json";
import api from "../../axiosConfig"; // Import the configured axios instance

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "",
    joiningDate: "",
    status: "active",
    membershipDuration: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Use the configured api instance which automatically handles credentials
      const response = await api.post("/members", formData);
      
      console.log("Success:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleAddAnother = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      membershipType: "",
      joiningDate: "",
      status: "active",
      membershipDuration: "",
    });
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="add-member-page">
      <div className="left-section">
        <div className="quote-box">
          <h1>"Push Yourself Because No One Else Is Going To Do It For You."</h1>
        </div>
      </div>

      <div className="right-section">
        {submitted ? (
          <div className="success-container">
            <Lottie animationData={successAnimation} loop={false} style={{ height: 250 }} />
            <h2>Member Added Successfully!</h2>
            <button onClick={handleAddAnother}>Add Another Member</button>
          </div>
        ) : (
          <form className="glass-form" onSubmit={handleSubmit}>
            <h2>Add Member</h2>

            {error && <div className="error-message">{error}</div>}

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              required
            >
              <option value="">Membership Type</option>
              <option value="Basic">Basic</option>
              <option value="Bronze">Bronze</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>

            <select 
              name="membershipDuration" 
              value={formData.membershipDuration} 
              onChange={handleChange}
              required
            >
              <option value="">Select Duration</option>
              <option value="30">1 month</option>
              <option value="90">3 months</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
            </select>
            
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />

            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMember;