import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import waveBackground from "../assets/lottie/wave.json"; // adjust path as needed
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT SIDE with image and quote */}
      <div className="auth-left-img">
        <div className="auth-quote">
          <h1>Welcome Back!</h1>
          <p>Your journey to strength starts here.</p>
        </div>
      </div>

      {/* RIGHT SIDE with form */}
      <div className="auth-right-form">
        <div className="lottie-bg">
          <Lottie animationData={waveBackground} loop autoPlay />
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign In</button>
          {error && <p className="error-msg">{error}</p>}
          <p className="switch-auth">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
