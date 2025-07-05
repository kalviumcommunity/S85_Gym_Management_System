import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
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
      // Check if user already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error('An account with this email already exists. Please use a different email address.');
      }

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
      console.error('Firebase error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists. Please use a different email address.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password authentication is not enabled. Please contact the administrator.');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Please choose a stronger password.');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address.');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your internet connection and try again.');
        default:
          throw new Error(error.message || 'Failed to create staff account. Please try again.');
      }
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
      
      console.log('Updating profile with:', updates);
      
      // Update Firebase Auth profile for display name and photo
      if (updates.displayName || updates.photoURL) {
        console.log('Updating Firebase Auth profile...');
        const authUser = auth.currentUser;
        if (!authUser) {
          throw new Error('No authenticated user found');
        }
        await updateProfile(authUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
        console.log('Firebase Auth profile updated successfully');
      }
      
      // Update Firestore document for additional profile data
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const existingData = userDoc.data();
        
        // Filter out undefined values and only include fields that have values
        const updatedData = {
          ...existingData,
          updatedAt: new Date().toISOString()
        };
        
        // Only add fields that have actual values (not undefined, null, or empty strings)
        if (updates.displayName) updatedData.name = updates.displayName;
        if (updates.email) updatedData.email = updates.email;
        if (updates.phone) updatedData.phoneNumber = updates.phone;
        if (updates.address) updatedData.address = updates.address;
        if (updates.dateOfBirth) updatedData.dateOfBirth = updates.dateOfBirth;
        if (updates.emergencyContact) updatedData.emergencyContact = updates.emergencyContact;
        if (updates.fitnessGoals) updatedData.fitnessGoals = updates.fitnessGoals;
        if (updates.medicalConditions) updatedData.medicalConditions = updates.medicalConditions;
        
        console.log('Updating Firestore with:', updatedData);
        await updateDoc(userRef, updatedData);
        console.log('Firestore updated successfully');
        
        // Update local state
        const updatedUser = {
          ...currentUser,
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        };
        
        // Only add fields that have actual values
        if (updates.phone) updatedUser.phoneNumber = updates.phone;
        if (updates.address) updatedUser.address = updates.address;
        if (updates.dateOfBirth) updatedUser.dateOfBirth = updates.dateOfBirth;
        if (updates.emergencyContact) updatedUser.emergencyContact = updates.emergencyContact;
        if (updates.fitnessGoals) updatedUser.fitnessGoals = updates.fitnessGoals;
        if (updates.medicalConditions) updatedUser.medicalConditions = updates.medicalConditions;
        setCurrentUser(updatedUser);
        console.log('Local state updated');
      } else {
        console.error('User document not found in Firestore');
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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