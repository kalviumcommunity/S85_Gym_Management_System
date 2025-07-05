import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import api from '../axiosConfig'
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/signup', formData);

      navigate('/login');
    } catch (err) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="background-overlay"></div>

      <div className="signup-card">
        <form className="signup-form" onSubmit={handleSignup}>
          <h2>Create an Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="staff">Staff</option>
          </select>

          <button type="submit">Sign Up</button>

          {error && <p className="error">{error}</p>}

          <p className="switch-auth">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
