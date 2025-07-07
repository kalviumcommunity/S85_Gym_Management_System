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

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [idToken, setIdToken] = useState(null);

  // Helper: Get Firebase ID token
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

  // Signup
  const signup = async (email, password, name, role = 'member') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
      await getFirebaseToken(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await getFirebaseToken(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          role: 'member',
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      }
      await getFirebaseToken(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setGoogleLoading(false);
    }
  };

  // Logout
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
      return 'member';
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

  // Token refresh interval
  useEffect(() => {
    if (currentUser) {
      const refreshToken = setInterval(async () => {
        try {
          await getFirebaseToken(currentUser);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(refreshToken);
    }
  }, [currentUser]);

  // Context value
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
    setLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 