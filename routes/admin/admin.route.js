const express = require('express');
const { addAdminUser, signIn, updateAdminDetails, deleteAdmin, viewAdminDetails } = require('../../controllers/admin/admin.controller');
const authenticateToken = require('../../middlewares/authenticateToken/authenticateToken');
const router = express.Router();

// Define routes
router.post('/admin/SignUp', authenticateToken, addAdminUser);
router.post('/admin/SignIn', signIn);
router.put('/update/:id/update-admin', authenticateToken, updateAdminDetails);
router.delete('/delete/:id/delete-admin', authenticateToken, deleteAdmin);
router.get('/view-admin/:id', authenticateToken, viewAdminDetails);

module.exports = router;
