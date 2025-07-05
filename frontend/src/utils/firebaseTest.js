import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseAuth = async () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testPassword123';
  const testName = 'Test User';

  console.log('🧪 Testing Firebase Authentication...');
  
  try {
    // Test 1: Check if email/password auth is enabled
    console.log('1. Testing email/password authentication...');
    const methods = await fetchSignInMethodsForEmail(auth, testEmail);
    console.log('✅ Email/password auth is enabled');

    // Test 2: Create a test user
    console.log('2. Creating test user...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword, testName);
    console.log('✅ Test user created successfully:', userCredential.user.email);

    // Test 3: Test Firestore write
    console.log('3. Testing Firestore write...');
    const userDoc = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDoc, {
      name: testName,
      email: testEmail,
      role: 'test',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Firestore write successful');

    // Test 4: Test Firestore read
    console.log('4. Testing Firestore read...');
    const userData = await getDoc(userDoc);
    console.log('✅ Firestore read successful:', userData.data());

    // Test 5: Clean up - delete test user
    console.log('5. Cleaning up test user...');
    await signOut(auth);
    console.log('✅ Test completed successfully');

    return {
      success: true,
      message: 'All Firebase tests passed!'
    };

  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    let errorMessage = 'Unknown error';
    
    switch (error.code) {
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication is not enabled in Firebase Console';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Test email already exists (this is unexpected)';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format';
        break;
      case 'permission-denied':
        errorMessage = 'Firestore permission denied - check security rules';
        break;
      default:
        errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};

export const checkFirebaseConfig = () => {
  console.log('🔧 Checking Firebase Configuration...');
  
  const config = {
    authDomain: auth.config.authDomain,
    projectId: auth.config.projectId,
    apiKey: auth.config.apiKey ? 'Set' : 'Not Set'
  };
  
  console.log('Firebase Config:', config);
  
  const issues = [];
  
  if (!auth.config.apiKey) {
    issues.push('API Key is missing');
  }
  
  if (!auth.config.authDomain) {
    issues.push('Auth Domain is missing');
  }
  
  if (!auth.config.projectId) {
    issues.push('Project ID is missing');
  }
  
  if (issues.length === 0) {
    console.log('✅ Firebase configuration looks good');
    return { valid: true };
  } else {
    console.log('❌ Firebase configuration issues:', issues);
    return { valid: false, issues };
  }
};

// Run tests when imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.testFirebase = testFirebaseAuth;
  window.checkFirebaseConfig = checkFirebaseConfig;
} 