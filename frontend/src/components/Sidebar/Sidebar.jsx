import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { Menu, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug logging
  console.log('Sidebar component - currentUser:', currentUser);
  console.log('Sidebar component - displayName:', currentUser?.displayName);
  console.log('Sidebar component - photoURL:', currentUser?.photoURL);
  console.log('Sidebar component - userRole:', userRole);
  console.log('Sidebar component - logout function:', typeof logout);

  // Helper function to get profile image source
  const getProfileImageSrc = () => {
    // If user has a photoURL, use it
    if (currentUser?.photoURL) {
      console.log('Sidebar - Using photoURL:', currentUser.photoURL);
      return currentUser.photoURL;
    }
    
    // If user has a displayName, generate avatar
    if (currentUser?.displayName) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=100`;
      console.log('Sidebar - Using generated avatar:', avatarUrl);
      return avatarUrl;
    }
    
    // Fallback to default avatar
    console.log('Sidebar - Using default avatar');
    return '/default-avatar.svg';
  };

  // Role-based navigation links
  const commonLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/shop', label: 'Shop' },
  ];
  const memberLinks = [
    { to: '/dashboard/member', label: 'My Membership' },
    { to: '/payments', label: 'Payment History' },
  ];
  const staffLinks = [
    { to: '/dashboard/staff', label: 'Staff Dashboard' },
    { to: '/members', label: 'View Members' },
    { to: '/send-notification', label: 'Send Notification' },
  ];
  const adminLinks = [
    { to: '/dashboard/admin', label: 'Admin Dashboard' },
    { to: '/staff', label: 'Manage Staff' },
    { to: '/create-staff', label: 'Add Staff' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/manage-shop', label: 'Manage Shop' },
    { to: '/services', label: 'Services' },
    { to: '/pending-signups', label: 'Pending Signups' },
  ];

  let navLinks = [...commonLinks];
  if (userRole === 'member') navLinks = [...navLinks, ...memberLinks];
  if (userRole === 'staff') navLinks = [...navLinks, ...staffLinks];
  if (userRole === 'admin') navLinks = [...navLinks, ...adminLinks];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <img src="https://res.cloudinary.com/dfgzjz1by/image/upload/v1751696297/Screenshot_304_od9iw1.png" alt="Logo" />
          <span>IronCore Fitness</span>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <img src="https://res.cloudinary.com/dfgzjz1by/image/upload/v1751696297/Screenshot_304_od9iw1.png" alt="Logo" />
          <span>IronCore Fitness</span>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname.startsWith(link.to) ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="profile-info">
            <img 
              src={getProfileImageSrc()} 
              alt="Profile" 
              onError={(e) => {
                console.error('Sidebar image failed to load:', e.target.src);
                e.target.src = '/default-avatar.svg';
              }}
              onLoad={(e) => {
                console.log('Sidebar image loaded successfully:', e.target.src);
              }}
            />
            <span>{currentUser?.displayName || 'User'}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={() => {
              console.log('Logout button clicked');
              logout();
              closeMobileMenu();
            }}
            style={{ 
              display: 'block', 
              visibility: 'visible', 
              opacity: 1,
              position: 'relative',
              zIndex: 1001,
              marginTop: '0.5rem',
              backgroundColor: '#ff0000', /* Temporary red background to make it very visible */
              color: 'white',
              border: '2px solid white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 