import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
        console.log("Signup Payload:", formData);

      const res = await axios.post("http://localhost:3000/api/auth/signup", formData);
      console.log(res.data);
      navigate("/login");
    } catch (err) {
        console.error("Signup error:", err.response?.data);
        if (err.response?.data?.errors) {
          setError(err.response.data.errors[0].msg); // shows first validation error
        } else {
          setError("Signup failed. Please try again.");
        }
      }
  };

  return (
    <div className="auth-page">
     <div className="auth-left" style={{ backgroundImage: "url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600')" }}>
  <h1>Join the Club</h1>
  <p>Fuel your fitness journey. Sign up and start tracking today!</p>
</div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Register</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="switch-auth">
  Already have an account? <a href="/login">Log in</a>
</p>

        </form>
      </div>
    </div>
  );
};

export default Signup;
