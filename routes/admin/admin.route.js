const express = require('express');
const { addAdminUser, signIn } = require('../../controllers/admin/admin.controller');
const authenticateToken = require('../../middlewares/authenticateToken/authenticateToken');
const router = express.Router();

// Define routes
router.post('/admin/SignUp', authenticateToken, addAdminUser);
router.post('/admin/SignIn', signIn);

module.exports = router;
