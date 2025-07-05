import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
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
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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
        approvedAt: null
      });

      return user;
    } catch (error) {
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
        approvedAt: null
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
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
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
  const updateUserProfile = async (uid, updates) => {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
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
    signup,
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