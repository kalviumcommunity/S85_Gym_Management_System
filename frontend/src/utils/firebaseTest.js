// Firebase test functions - disabled for build compatibility

export const testFirebaseAuth = async () => {
  return {
    success: false,
    error: 'Firebase tests disabled for build compatibility',
    code: 'BUILD_DISABLED'
  };
};

export const checkFirebaseConfig = () => {
  return {
    valid: false,
    issues: ['Firebase tests disabled for build compatibility']
  };
};

// Run tests when imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.testFirebase = testFirebaseAuth;
  window.checkFirebaseConfig = checkFirebaseConfig;
} 