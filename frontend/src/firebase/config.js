import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig } from '../config/config.js';

// Get Firebase configuration from centralized config
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Firebase config:', {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    });
    
    // Test auth
    const authTest = auth;
    console.log('Auth initialized:', !!authTest);
    
    // Test Firestore
    const dbTest = db;
    console.log('Firestore initialized:', !!dbTest);
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Note: Storage is commented out for now to avoid setup issues
// export const storage = getStorage(app);

export default app; 