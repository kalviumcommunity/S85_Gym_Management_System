import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import './Navbar.css';
import logo from '../../assets/img/Screenshot (304).png'; // update path based on your structure

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authData, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthData(null);
    navigate('/login');
  };

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

          {/* Links visible only for admin/staff */}
          {authData && (authData.role === 'admin' || authData.role === 'staff') && (
            <>
              <li><NavLink to="/add" className="nav-link">Add Member</NavLink></li>
              <li><NavLink to="/members" className="nav-link">Members</NavLink></li>
            </>
          )}

          {/* Links visible only for admin */}
          {authData && authData.role === 'admin' && (
            <li><NavLink to="/dashboard" className="nav-link">Dashboard</NavLink></li>
          )}

          {/* Links for unauthenticated users */}
          {!authData ? (
            <>
              <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
              <li><NavLink to="/signup" className="nav-link">Signup</NavLink></li>
            </>
          ) : (
            <li><button onClick={handleLogout} className="nav-link">Logout</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
