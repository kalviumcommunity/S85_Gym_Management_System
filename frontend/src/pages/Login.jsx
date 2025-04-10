import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

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
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome Back</h1>
        <p>Train hard, stay strong. Log in to manage your gym journey!</p>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Sign In</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="switch-auth">
  Don't have an account? <a href="/signup">Sign up</a>
</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
