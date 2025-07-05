// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  updateMyProfile
} = require('../controllers/memberController');

router.use(protect, authorizeRoles('member'));

router.get('/me', getMyProfile);
router.put('/update-me', updateMyProfile);

module.exports = router;
