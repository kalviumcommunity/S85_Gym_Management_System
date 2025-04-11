import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/img/Screenshot (304).png'; // update path based on your structure

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Gym Logo" className="logo-img" />
        <span>Gym Management</span>
      </div>

      <div className="right-container">
        <div className="hamburger" onClick={toggleMenu}>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </div>

        <ul className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          <li><NavLink to="/" className="nav-link">Home</NavLink></li>
          <li><NavLink to="/add" className="nav-link">AddMember</NavLink></li>
          <li><NavLink to="/members" className="nav-link">Members</NavLink></li>
          <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
          <li><NavLink to="/signup" className="nav-link">Signup</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
