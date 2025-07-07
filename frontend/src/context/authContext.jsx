import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [idToken, setIdToken] = useState(null);

  // Get Firebase ID token
  const getFirebaseToken = async (user) => {
    try {
      if (user) {
        const token = await getIdToken(user, true); // Force refresh
        setIdToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  };

  // Sign up function
  const signup = async (email, password, name, role = 'member') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Get ID token for backend authentication
      await getFirebaseToken(user);

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get ID token for backend authentication
      await getFirebaseToken(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          role: 'member',
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }

      // Get ID token for backend authentication
      await getFirebaseToken(user);

      return user;
    } catch (error) {
      throw error;
    } finally {
      setGoogleLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setIdToken(null);
    } catch (error) {
      throw error;
    }
  };

  // Get user role from Firestore
  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserStatus(userData.status || 'active');
        return userData.role;
      }
      return 'member'; // default role
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'member';
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user.uid);
        setUserRole(role);
        
        // Get ID token for backend authentication
        await getFirebaseToken(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserStatus('active');
        setIdToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Set up token refresh
  useEffect(() => {
    if (currentUser) {
      const refreshToken = setInterval(async () => {
        try {
          await getFirebaseToken(currentUser);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 10 * 60 * 1000); // Refresh every 10 minutes

      return () => clearInterval(refreshToken);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userRole,
    userStatus,
    loading,
    googleLoading,
    idToken,
    signup,
    login,
    logout,
    signInWithGoogle,
    getFirebaseToken,
    setCurrentUser,
    setUserRole,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};