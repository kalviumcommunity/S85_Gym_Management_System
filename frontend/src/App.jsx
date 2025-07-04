import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Common Pages
import Dashboard from "./pages/common/Dashboard";
import Profile from "./pages/common/Profile";
import Notifications from "./pages/common/Notifications";
import Shop from "./pages/common/Shop";

// Member Pages
import MemberDashboard from "./pages/member/MemberDashboard";
import Membership from "./pages/member/Membership";
import Payments from "./pages/member/Payments";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import ViewMembers from "./pages/staff/ViewMembers";
import SendNotification from "./pages/staff/SendNotification";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStaff from "./pages/admin/ManageStaff";
import CreateStaff from "./pages/admin/CreateStaff";
import Analytics from "./pages/admin/Analytics";
import ManageShop from "./pages/admin/ManageShop";
import Services from "./pages/admin/Services";
import PendingSignups from "./pages/admin/PendingSignups";

// Error Pages
import AccessDenied from "./pages/common/AccessDenied";
import NotFound from "./pages/common/NotFound";

import "./App.css";

const AppContent = () => {
  const { currentUser, loading, userRole } = useAuth();
  
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex' }}>
          {currentUser && <Sidebar />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* ...all other routes as before... */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
              <Route path="/dashboard/member" element={<ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>} />
              <Route path="/membership" element={<ProtectedRoute allowedRoles={['member']}><Membership /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute allowedRoles={['member']}><Payments /></ProtectedRoute>} />
              <Route path="/dashboard/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><ViewMembers /></ProtectedRoute>} />
              <Route path="/send-notification" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><SendNotification /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute allowedRoles={['admin']}><ManageStaff /></ProtectedRoute>} />
              <Route path="/create-staff" element={<ProtectedRoute allowedRoles={['admin']}><CreateStaff /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
              <Route path="/manage-shop" element={<ProtectedRoute allowedRoles={['admin']}><ManageShop /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute allowedRoles={['admin']}><Services /></ProtectedRoute>} />
              <Route path="/pending-signups" element={<ProtectedRoute allowedRoles={['admin']}><PendingSignups /></ProtectedRoute>} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
