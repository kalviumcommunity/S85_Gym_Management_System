# 🔥 Firebase Setup Guide - IronCore Fitness

## ✅ **Step 1: Firebase Project Setup (COMPLETED)**

Your Firebase project is already created with the following details:
- **Project Name**: ironcore-fitness-web
- **Project ID**: ironcore-fitness-web
- **Config**: Already updated in the code

## 🔐 **Step 2: Enable Authentication**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ironcore-fitness-web**
3. Click **"Authentication"** in the left sidebar
4. Click **"Get started"**
5. Go to **"Sign-in method"** tab
6. Click on **"Email/Password"**
7. **Enable** it and click **"Save"**

## 🗄️ **Step 3: Create Firestore Database**

1. In Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a **location** close to you (e.g., us-central1)
5. Click **"Done"**

## 🔒 **Step 4: Set Up Firestore Security Rules**

1. In Firestore Database, go to **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admin to read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **"Publish"**

## 🌐 **Step 5: Environment Variables (Optional but Recommended)**

Create a `.env` file in the `frontend` folder with:

```env
VITE_FIREBASE_API_KEY=AIzaSyCxJ2tNHnQ7YkLU5EJflD-dy5oTGM1b6rA
VITE_FIREBASE_AUTH_DOMAIN=ironcore-fitness-web.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ironcore-fitness-web
VITE_FIREBASE_STORAGE_BUCKET=ironcore-fitness-web.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=826745766393
VITE_FIREBASE_APP_ID=1:826745766393:web:54ca90c0171af28ba0bd28
VITE_FIREBASE_MEASUREMENT_ID=G-1FK6RXLCRJ
```

## 🚀 **Step 6: Test Your Setup**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to: `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is busy)

3. **Test the signup process**:
   - Click "Sign up here" on the login page
   - Create a new account
   - Verify it redirects to the dashboard

4. **Test the login process**:
   - Log out and log back in
   - Verify role-based navigation works

## 🎯 **Step 7: Create Admin User (Optional)**

To test admin features, you can manually update a user's role in Firestore:

1. Go to **Firestore Database** → **Data** tab
2. Find your user document in the `users` collection
3. Click on the document
4. Change the `role` field from `"member"` to `"admin"`
5. Click **"Update"**

## 🔧 **Troubleshooting**

### **Authentication Issues**
- Make sure Email/Password is enabled in Authentication
- Check that the Firebase config is correct
- Verify the project ID matches

### **Database Issues**
- Ensure Firestore is created and in test mode
- Check that security rules are published
- Verify the database location is accessible

### **Development Server Issues**
- Make sure all dependencies are installed: `npm install`
- Check for any console errors in the browser
- Verify the port 5173 (or 5174) is not in use
- If port 5173 is busy, Vite will automatically use 5174

## 📱 **Features Available After Setup**

✅ **User Registration & Login**
✅ **Profile Management** (with auto-generated avatars)
✅ **Role-Based Access Control**
✅ **Member Dashboard**
✅ **Staff Dashboard** (when role is set to 'staff')
✅ **Admin Dashboard** (when role is set to 'admin')
✅ **Protected Routes**
✅ **Responsive Design**

## 🎉 **Congratulations!**

Your IronCore Fitness gym management system is now fully functional with:
- **100% FREE** Firebase hosting
- **Secure authentication**
- **Role-based access**
- **Modern UI/UX**
- **Responsive design**

## 🔮 **Next Steps (Optional)**

- Deploy to Firebase Hosting for production
- Add more features like payment integration
- Implement real-time notifications
- Add analytics and reporting

---

**Your gym management system is ready to use! 🏋️‍♂️✨**

# Firebase Authentication Setup Guide

## Issues and Solutions

### 1. "auth/operation-not-allowed" Error
This error occurs when Email/Password authentication is not enabled in your Firebase project.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ironcore-fitness-web`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### 2. "auth/email-already-in-use" Error
This error occurs when trying to create an account with an email that already exists.

**Solution:**
- The code now checks for existing accounts before creation
- Use a different email address for new staff members

### 3. Firebase Configuration
Make sure your Firebase configuration is correct in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCxJ2tNHnQ7YkLU5EJflD-dy5oTGM1b6rA",
  authDomain: "ironcore-fitness-web.firebaseapp.com",
  projectId: "ironcore-fitness-web",
  storageBucket: "ironcore-fitness-web.firebasestorage.app",
  messagingSenderId: "826745766393",
  appId: "1:826745766393:web:54ca90c0171af28ba0bd28",
  measurementId: "G-1FK6RXLCRJ"
};
```

## Required Firebase Settings

### Authentication Providers
Enable these providers in Firebase Console:
1. **Email/Password** - Required for staff account creation
2. **Google** - Optional for Google sign-in

### Firestore Rules
Make sure your Firestore security rules allow write access for authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        (resource.data.role == 'admin' || request.auth.uid == userId);
    }
  }
}
```

### Environment Variables (Optional)
For better security, use environment variables:

Create a `.env` file in the frontend directory:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Testing the Setup

1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Test staff creation:
   - Login as admin
   - Navigate to Create Staff
   - Try creating a new staff account with a unique email

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your Firebase project allows requests from `localhost:5173`
2. **Network errors**: Check your internet connection
3. **Permission denied**: Verify Firestore security rules
4. **Invalid API key**: Double-check your Firebase configuration

### Debug Steps:
1. Open browser developer tools
2. Check the Console tab for detailed error messages
3. Check the Network tab for failed requests
4. Verify Firebase project settings match your configuration

## Support
If you continue to have issues:
1. Check Firebase Console for any error messages
2. Verify your Firebase project is on the correct plan (Spark/Blaze)
3. Ensure all required services are enabled
4. Check that your domain is authorized in Firebase Console 