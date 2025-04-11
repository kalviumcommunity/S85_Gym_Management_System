import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import signupAnim from "../assets/lottie/Animation - 1744290292537.json"; // Your entry animation
import successAnim from "../assets/lottie/Animation - 1744290231086.json"; // Success animation
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/auth/signup", formData);
      console.log(res.data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Show success animation for 2s
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="background-overlay" />
      <div className="signup-card">
        <div className="signup-lottie">
          {success ? (
            <Lottie animationData={successAnim} loop={false} className="lottie-success-large" />
          ) : (
            <Lottie animationData={signupAnim} loop={true}  className="lottie-sign-large"/>
          )}
        </div>
        {!success && (
          <form className="signup-form" onSubmit={handleSignup}>
            <h2>Create Your Account</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <p className="error">{error}</p>}
            <p className="switch-auth">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
