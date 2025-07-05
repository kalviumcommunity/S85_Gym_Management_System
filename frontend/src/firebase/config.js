import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxJ2tNHnQ7YkLU5EJflD-dy5oTGM1b6rA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ironcore-fitness-web.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ironcore-fitness-web",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ironcore-fitness-web.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "826745766393",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:826745766393:web:54ca90c0171af28ba0bd28",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1FK6RXLCRJ"
};

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