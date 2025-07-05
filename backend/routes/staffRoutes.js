// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  addMember,
  updateMember,
  markAttendance
} = require('../controllers/staffController');

// Only accessible by staff
router.use(protect, authorizeRoles('staff'));

router.post('/add-member', addMember);
router.put('/update-member/:id', updateMember);
router.post('/attendance/:memberId', markAttendance);

module.exports = router;
