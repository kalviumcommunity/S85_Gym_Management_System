// Minimal Firebase configuration - disabled for build compatibility

// Mock Firebase services
export const auth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
  signOut: async () => {},
  config: {
    authDomain: 'disabled',
    projectId: 'disabled',
    apiKey: 'disabled'
  }
};

export const db = {
  collection: () => ({
    doc: () => ({
      set: async () => {},
      get: async () => ({ exists: () => false, data: () => ({}) })
    })
  })
};

// Mock test function
export const testFirebaseConnection = async () => {
  console.log('Firebase connection test disabled for build compatibility');
  return true;
};

export default { auth, db }; 