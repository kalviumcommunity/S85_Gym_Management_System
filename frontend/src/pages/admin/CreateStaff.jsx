import React, { useState } from 'react';
import { useAuth } from '../../context';
import { UserPlus, Mail, User, Lock, Eye, EyeOff, Bug, TestTube } from 'lucide-react';
import './AdminPages.css';

const CreateStaff = () => {
  const { createStaffAccount } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [debugResult, setDebugResult] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await createStaffAccount(
        formData.email,
        formData.password,
        formData.name
      );

      setSuccess('Staff account created successfully! The staff member will receive an email to set up their account.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error creating staff account:', error);
      
      // Handle different types of errors
      if (error.message.includes('email already exists')) {
        setError('This email is already registered. Please use a different email address.');
      } else if (error.message.includes('authentication is not enabled')) {
        setError('Email/password authentication is not enabled. Please contact the system administrator.');
      } else if (error.message.includes('weak password')) {
        setError('Password is too weak. Please choose a stronger password with at least 6 characters.');
      } else if (error.message.includes('valid email')) {
        setError('Please enter a valid email address.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'Failed to create staff account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const runFirebaseTest = async () => {
    try {
      setDebugResult('Running Firebase test...');
      
      // Import the test function dynamically
      const { testFirebaseAuth, checkFirebaseConfig } = await import('../../utils/firebaseTest');
      
      // Check config first
      const configResult = checkFirebaseConfig();
      console.log('Config check result:', configResult);
      
      if (!configResult.valid) {
        setDebugResult(`❌ Configuration issues: ${configResult.issues.join(', ')}`);
        return;
      }
      
      // Run auth test
      const result = await testFirebaseAuth();
      
      if (result.success) {
        setDebugResult('✅ All Firebase tests passed! Authentication is working correctly.');
      } else {
        setDebugResult(`❌ Test failed: ${result.error} (Code: ${result.code})`);
      }
    } catch (error) {
      console.error('Debug test error:', error);
      setDebugResult(`❌ Debug test error: ${error.message}`);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>Create Staff Account</h1>
          <p>Add new staff members to your gym team</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="create-staff-form">
          <div className="form-header">
            <UserPlus size={48} />
            <h2>New Staff Member</h2>
            <p>Fill in the details below to create a new staff account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                <User size={20} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={20} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={20} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={20} />
                Confirm Password
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Staff Account'}
              </button>
            </div>
          </form>

          {/* Debug Section */}
          <div className="debug-section">
            <button
              type="button"
              className="debug-toggle"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug size={20} />
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
            
            {showDebug && (
              <div className="debug-panel">
                <h3>Firebase Debug Tools</h3>
                <p>Use these tools to test and diagnose Firebase authentication issues.</p>
                
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={runFirebaseTest}
                >
                  <TestTube size={20} />
                  Test Firebase Authentication
                </button>
                
                {debugResult && (
                  <div className="debug-result">
                    <pre>{debugResult}</pre>
                  </div>
                )}
                
                <div className="debug-info">
                  <h4>Common Issues:</h4>
                  <ul>
                    <li><strong>auth/operation-not-allowed:</strong> Enable Email/Password auth in Firebase Console</li>
                    <li><strong>auth/email-already-in-use:</strong> Use a different email address</li>
                    <li><strong>permission-denied:</strong> Check Firestore security rules</li>
                    <li><strong>network errors:</strong> Check internet connection</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="form-info">
            <h3>What happens next?</h3>
            <ul>
              <li>The staff member will receive an email with their login credentials</li>
              <li>Their account will be created with "Pending Approval" status</li>
              <li>You can approve or reject their account from the "Manage Staff" page</li>
              <li>Once approved, they'll have access to staff features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff; 