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
      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Member added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          membershipType: "",
          joiningDate: "",
          status: "active",
        });
        onMemberAdded(); // Refresh list after adding
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Member</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="membershipType" placeholder="Membership Type" value={formData.membershipType} onChange={handleChange} required />
        <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
  
};

export default AddMember;
