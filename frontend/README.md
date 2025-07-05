# IronCore Fitness - Gym Management System

A modern, full-stack gym management system built with React + Firebase, featuring role-based dashboards, authentication, and premium UI/UX design.

## 🚀 Features

### Authentication & User Management
- Firebase Authentication with email/password
- Profile picture upload and management
- Role-based access control (Member, Staff, Admin)
- Secure protected routes

### Role-Based Dashboards
- **Member Dashboard**: View membership status, track workouts, manage payments
- **Staff Dashboard**: Manage members, send notifications, handle check-ins
- **Admin Dashboard**: Full system control, analytics, staff management

### Modern UI/UX
- Glassmorphism design with blur effects
- Responsive layout for all devices
- Smooth animations and transitions
- Premium gradient backgrounds
- Modern iconography with Lucide React

### Core Features
- User authentication and authorization
- Role-based navigation
- Profile management
- Notification system (placeholder)
- Shop management (placeholder)
- Analytics and reporting (placeholder)
- Payment integration (placeholder)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Styling**: CSS3 with Glassmorphism
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gym_Management_System/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase config

4. **Configure Firebase**
   - Open `src/firebase/config.js`
   - Replace the placeholder config with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will run on `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is busy)
   
   The application will run on `http://localhost:5173/`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar/           # Navigation component
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.module.css
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── PlaceholderPage.jsx # Reusable placeholder
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── firebase/
│   │   └── config.js         # Firebase configuration
│   ├── pages/
│   │   ├── auth/             # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── common/           # Shared pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── AccessDenied.jsx
│   │   │   └── NotFound.jsx
│   │   ├── member/           # Member-specific pages
│   │   │   ├── MemberDashboard.jsx
│   │   │   ├── Membership.jsx
│   │   │   └── Payments.jsx
│   │   ├── staff/            # Staff-specific pages
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── ViewMembers.jsx
│   │   │   └── SendNotification.jsx
│   │   └── admin/            # Admin-specific pages
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageStaff.jsx
│   │       ├── Analytics.jsx
│   │       ├── ManageShop.jsx
│   │       ├── Services.jsx
│   │       └── PendingSignups.jsx
│   ├── App.jsx               # Main app component
│   └── main.jsx              # App entry point
```

## 🔐 User Roles

### Member
- View personal dashboard
- Check membership status
- View payment history
- Access gym services
- Update profile

### Staff
- All member permissions
- View all members
- Send notifications
- Manage check-ins
- Handle member queries

### Admin
- All staff permissions
- Manage staff members
- View analytics and reports
- Manage shop inventory
- Control system settings
- Approve new signups

## 🎨 Design System

### Colors
- Primary: `#00CFFF` (Neon Blue)
- Secondary: `#2ed573` (Green)
- Accent: `#feca57` (Yellow)
- Error: `#ff6b7a` (Red)
- Background: Dark gradient with glassmorphism

### Typography
- Font Family: Segoe UI
- Weights: 400, 500, 600, 700

### Components
- Glassmorphism cards with backdrop blur
- Smooth hover animations
- Gradient text effects
- Responsive grid layouts

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔮 Future Enhancements

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with fitness trackers
- [ ] Class booking system
- [ ] Personal training management
- [ ] Equipment tracking
- [ ] Member check-in system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for IronCore Fitness**
