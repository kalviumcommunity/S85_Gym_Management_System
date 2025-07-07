// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  getMyMembership
} = require('../controllers/memberController');

router.use(verifyFirebaseToken, authorizeRoles('member'));

router.get('/me', getMyProfile);
router.put('/update-me', updateMyProfile);
router.get('/membership', getMyMembership);

module.exports = router;
