import React, { useState } from "react";
import "./AddMember.css";
import Lottie from "lottie-react";
import successAnimation from "../../assets/success.json/Animation - 1744280050642.json";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form");
  
    try {
      const token = localStorage.getItem("token"); // adjust if you're storing token differently
  
      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add member");
      }
  
      const data = await response.json();
      console.log("Success:", data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Something went wrong while adding the member.");
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

            {/* ✅ Membership Duration dropdown */}
            <select name="membershipDuration" value={formData.membershipDuration} onChange={handleChange}>
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
