import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Activity,
  Award
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    fitnessGoals: '',
    medicalConditions: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        emergencyContact: currentUser.emergencyContact || '',
        fitnessGoals: currentUser.fitnessGoals || '',
        medicalConditions: currentUser.medicalConditions || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateUserProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to update profile: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: currentUser.phoneNumber || '',
      address: currentUser.address || '',
      dateOfBirth: currentUser.dateOfBirth || '',
      emergencyContact: currentUser.emergencyContact || '',
      fitnessGoals: currentUser.fitnessGoals || '',
      medicalConditions: currentUser.medicalConditions || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getMembershipStatus = () => {
    if (!currentUser) return 'Unknown';
    if (currentUser.role === 'admin') return 'Administrator';
    if (currentUser.role === 'staff') return 'Staff Member';
    if (currentUser.role === 'member') return 'Active Member';
    return 'Pending';
  };

  const getStatusColor = () => {
    if (!currentUser) return '#666';
    if (currentUser.role === 'admin') return '#ff6b7a';
    if (currentUser.role === 'staff') return '#00CFFF';
    if (currentUser.role === 'member') return '#2ed573';
    return '#feca57';
  };

  // Helper function to get profile image source
  const getProfileImageSrc = () => {
    // If user has a photoURL, use it
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    
    // If user has a displayName, generate avatar
    if (currentUser?.displayName) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=200`;
      return avatarUrl;
    }
    
    // Fallback to default avatar
    return '/default-avatar.svg';
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1>Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <div className="header-actions">
          {!isEditing ? (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}



      <div className="profile-content">
        <div className="profile-grid">
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture">
              <img 
                src={getProfileImageSrc()}
                alt="Profile" 
                onError={(e) => {
                  e.target.src = '/default-avatar.svg';
                }}
              />

              {isEditing && (
                <button className="camera-btn">
                  <Camera size={20} />
                </button>
              )}
            </div>
            <div className="profile-status">
              <div className="status-badge" style={{ '--status-color': getStatusColor() }}>
                <Shield size={16} />
                {getMembershipStatus()}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group full-width">
                <label>
                  <MapPin size={16} />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="info-section">
            <h2>Emergency Contact</h2>
            <div className="form-group">
              <label>
                <Phone size={16} />
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter emergency contact number"
              />
            </div>
          </div>

          {/* Fitness Information */}
          <div className="info-section">
            <h2>Fitness Information</h2>
            <div className="form-group">
              <label>
                <Activity size={16} />
                Fitness Goals
              </label>
              <textarea
                name="fitnessGoals"
                value={formData.fitnessGoals}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Describe your fitness goals"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>
                <Award size={16} />
                Medical Conditions
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="List any medical conditions or allergies"
                rows="3"
              />
            </div>
          </div>

          {/* Account Statistics */}
          <div className="info-section">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar size={20} />
                </div>
                <div className="stat-content">
                  <h4>Member Since</h4>
                  <p>{currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Activity size={20} />
                </div>
                <div className="stat-content">
                  <h4>Last Login</h4>
                  <p>{currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 