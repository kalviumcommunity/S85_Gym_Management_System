// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  addMember,
  updateMember,
  markAttendance,
  getAllMembers,
  getMemberById,
  sendNotification,
  getNotificationHistory
} = require('../controllers/staffController');

// Only accessible by staff and admin
router.use(verifyFirebaseToken, authorizeRoles('staff', 'admin'));

// Member management routes
router.post('/add-member', addMember);
router.put('/update-member/:id', updateMember);
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberById);
router.post('/attendance/:memberId', markAttendance);

// Notification routes
router.post('/send-notification', sendNotification);
router.get('/notifications', getNotificationHistory);

module.exports = router;
