import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { to: '/login', label: 'Login' },
        { to: '/signup', label: 'Signup' }
      ];
    }

    const commonLinks = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
      { to: '/notifications', label: 'Notifications' },
      { to: '/shop', label: 'Shop' }
    ];

    // Member-specific links
    if (userRole === 'member') {
      return [
        ...commonLinks,
        { to: '/membership', label: 'My Membership' },
        { to: '/payments', label: 'Payment History' }
      ];
    }

    // Staff-specific links
    if (userRole === 'staff') {
      return [
        ...commonLinks,
        { to: '/members', label: 'View Members' },
        { to: '/send-notification', label: 'Send Notification' }
      ];
    }

    // Admin-specific links
    if (userRole === 'admin') {
      return [
        ...commonLinks,
        { to: '/members', label: 'View Members' },
        { to: '/staff', label: 'Manage Staff' },
        { to: '/analytics', label: 'Analytics' },
        { to: '/manage-shop', label: 'Manage Shop' },
        { to: '/services', label: 'Manage Services' },
        { to: '/pending-signups', label: 'Pending Signups' }
      ];
    }

    return commonLinks;
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img 
          src="https://res.cloudinary.com/dfgzjz1by/image/upload/v1751696297/Screenshot_304_od9iw1.png" 
          alt="IronCore Fitness Logo" 
          className="logo-img" 
        />
        <span>IronCore Fitness</span>
      </div>

      <div className="right-container">
        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          {getNavLinks().map((link) => (
            <li key={link.to}>
              <NavLink 
                to={link.to} 
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {currentUser && (
            <li className="user-section">
              <div className="user-info">
                <img 
                  src={currentUser.photoURL || '/default-avatar.png'} 
                  alt="Profile" 
                  className="user-avatar"
                />
                <span className="user-name">{currentUser.displayName}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
