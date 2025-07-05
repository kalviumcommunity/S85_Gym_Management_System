import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db, testFirebaseConnection } from '../firebase/config';

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
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  // Sign up function for regular members
  const signup = async (email, password, name, profilePic = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Use a default avatar URL instead of uploading
      const defaultAvatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00CFFF&color=fff&size=200`;

      // Update profile display name
      await updateProfile(user, {
        displayName: name,
        photoURL: defaultAvatarURL
      });

      // Save user data to Firestore with 'member' role
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'member', // Default role for signups
        status: 'active', // Active status
        profileURL: defaultAvatarURL,
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        authProvider: 'email'
      });

      // Set the user state immediately
      const mergedUser = {
        ...user,
        displayName: name,
        photoURL: defaultAvatarURL
      };
      setCurrentUser(mergedUser);
      setUserRole('member');
      setUserStatus('active');

      return mergedUser;
    } catch (error) {
      throw error;
    }
  };

  // Google Sign In with Popup
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      console.log('Starting Google sign-in...');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user.email);

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('Creating new user profile...');
        // New user - create profile with member role
        const profileURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=00CFFF&color=fff&size=200`;
        
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Google User',
          email: user.email,
          role: 'member', // Default role for Google signups
          status: 'active',
          profileURL: profileURL,
          createdAt: new Date().toISOString(),
          approvedBy: null,
          approvedAt: null,
          authProvider: 'google'
        });

        // Set the user state immediately for new Google users
        const mergedUser = {
          ...user,
          displayName: user.displayName || 'Google User',
          photoURL: profileURL
        };
        setCurrentUser(mergedUser);
        setUserRole('member');
        setUserStatus('active');
        console.log('New user created with member role');
      } else {
        console.log('Existing user found, getting role...');
        // Existing user - get their role from Firestore
        const userData = userDoc.data();
        const mergedUser = {
          ...user,
          displayName: userData.name || user.displayName || 'User',
          photoURL: userData.profileURL || user.photoURL || null
        };
        setCurrentUser(mergedUser);
        setUserRole(userData.role);
        setUserStatus(userData.status);
        console.log('Existing user role:', userData.role);
      }

      setGoogleLoading(false);
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setGoogleLoading(false);
      throw error;
    }
  };

  // Create staff account (admin only)
  const createStaffAccount = async (email, password, name, profilePic = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const defaultAvatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00CFFF&color=fff&size=200`;

      await updateProfile(user, {
        displayName: name,
        photoURL: defaultAvatarURL
      });

      // Save user data with 'pending_staff' role
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'pending_staff', // Pending approval
        status: 'pending', // Pending status
        profileURL: defaultAvatarURL,
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        authProvider: 'email'
      });

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Approve staff member (admin only)
  const approveStaffMember = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'staff',
        status: 'active',
        approvedBy: currentUser.uid,
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  };

  // Reject staff member (admin only)
  const rejectStaffMember = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'member', // Demote to member
        status: 'active',
        approvedBy: currentUser.uid,
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  };

  // Get pending staff members (admin only)
  const getPendingStaffMembers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'pending_staff')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  };

  // Get all staff members (admin only)
  const getAllStaffMembers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', 'in', ['staff', 'pending_staff'])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData = {};
      
      if (userDoc.exists()) {
        userData = userDoc.data();
        setUserRole(userData.role);
        setUserStatus(userData.status);
      }
      
      // Merge Firebase Auth user with Firestore data
      const mergedUser = {
        ...user,
        displayName: userData.name || user.displayName || 'User',
        photoURL: userData.profileURL || user.photoURL || null
      };
      
      setCurrentUser(mergedUser);
      return mergedUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      // Clear user state
      setCurrentUser(null);
      setUserRole(null);
      setUserStatus(null);
    } catch (error) {
      throw error;
    }
  };

  // Get user role and status from Firestore
  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserStatus(userData.status);
        return userData.role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
      }
      
      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const existingData = userDoc.data();
        const updatedData = {
          ...existingData,
          name: updates.displayName || existingData.name,
          email: updates.email || existingData.email,
          phoneNumber: updates.phone || existingData.phoneNumber,
          address: updates.address || existingData.address,
          dateOfBirth: updates.dateOfBirth || existingData.dateOfBirth,
          emergencyContact: updates.emergencyContact || existingData.emergencyContact,
          fitnessGoals: updates.fitnessGoals || existingData.fitnessGoals,
          medicalConditions: updates.medicalConditions || existingData.medicalConditions,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, updatedData);
        
        // Update local state
        const updatedUser = {
          ...currentUser,
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        };
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      throw error;
    }
  };

  // Upload profile picture (simplified - uses UI Avatars service)
  const uploadProfilePicture = async (uid, file) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userName = userDoc.data().name;
        const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=00CFFF&color=fff&size=200`;
        
        await updateUserProfile(uid, { profileURL: avatarURL });
        return avatarURL;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Test Firebase connection on mount
    testFirebaseConnection().then(success => {
      console.log('Firebase connection test result:', success);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', { user: !!user, email: user?.email });
      
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData = {};
        
        if (userDoc.exists()) {
          userData = userDoc.data();
          setUserRole(userData.role);
          setUserStatus(userData.status);
        }
        
        // Merge Firebase Auth user with Firestore data
        const mergedUser = {
          ...user,
          displayName: userData.name || user.displayName || 'User',
          photoURL: userData.profileURL || user.photoURL || null
        };
        
        setCurrentUser(mergedUser);
        console.log('Setting current user:', mergedUser.email, 'with displayName:', mergedUser.displayName);
      } else {
        console.log('No user, clearing state');
        setCurrentUser(null);
        setUserRole(null);
        setUserStatus(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userStatus,
    loading,
    googleLoading,
    signup,
    signInWithGoogle,
    createStaffAccount,
    approveStaffMember,
    rejectStaffMember,
    getPendingStaffMembers,
    getAllStaffMembers,
    login,
    logout,
    updateUserProfile,
    uploadProfilePicture,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};