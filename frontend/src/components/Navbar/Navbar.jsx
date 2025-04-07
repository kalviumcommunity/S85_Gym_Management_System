// components/Navbar/Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // ✅ Using your existing CSS

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Gym Management</div>
      <ul className="navbar-links">
        <li><NavLink to="/" className="nav-link">Home</NavLink></li>
        <li><NavLink to="/add" className="nav-link">Add Member</NavLink></li>
        <li><NavLink to="/members" className="nav-link">View Members</NavLink></li>
        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>

        <li><NavLink to="/signup" className="nav-link">Signup</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
