import { useState } from "react";
import "./AddMember.css";

const AddMember = ({ onMemberAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "",
    joiningDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ No token found. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("✅ Member added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          membershipType: "",
          joiningDate: "",
          status: "Active",
        });
        if (onMemberAdded) onMemberAdded();
      } else {
        console.error("Failed to add member:", responseData.message || responseData.error);
        alert(`❌ Failed to add member: ${responseData.message || responseData.error}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="gym-add-wrapper">
      <div className="form-container animated-form">
        <h2>Add New Gym Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="membershipType"
              placeholder="Membership Type (e.g., Premium, Standard)"
              value={formData.membershipType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Member</button>
        </form>
      </div>

      <p className="gym-quote">"Train insane or remain the same"</p>
    </div>
  );
};

export default AddMember;
