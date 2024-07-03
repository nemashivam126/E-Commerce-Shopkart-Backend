const express = require('express');
const { addUser, viewUser, getUsers, addToCart, removeFromCart, updateCartQuantity, viewUserCart, signIn, getCartCount, addAddress, updateAddress, deleteAddress, getAddresses, setSelectedAddress, setUserOrder, emptyCart, viewUserOrders, getOrderItemById, getAllUserOrders, getAllUsersOrders, updateOrderItemStatus } = require('../../controllers/users/user.controller');
const authenticateToken = require('../../helper/authenticateToken/authenticateToken');
const router = express.Router();

// Define routes
router.post('/SignUp', addUser);
router.get('/view-user/:id', authenticateToken, viewUser);
router.get('/users', authenticateToken, getUsers);
router.put('/user/:id/addtocart', authenticateToken, addToCart);
router.delete('/user/:id/remove-cart', authenticateToken, removeFromCart);
router.put('/user/:id/updatecart', authenticateToken, updateCartQuantity);
router.get('/user/:id/cart', authenticateToken, viewUserCart);
router.post('/SignIn', signIn);
router.get('/cart-count/:id', authenticateToken, getCartCount);
router.post('/user/:id/add-address', authenticateToken, addAddress);
router.put('/user/:id/addresses/:addressId', authenticateToken, updateAddress);
router.delete('/user/:id/addresses/:addressId', authenticateToken, deleteAddress);
router.get('/user/:id/addresses', authenticateToken, getAddresses);
router.put('/user/:id/selected-address/:addressId', authenticateToken, setSelectedAddress);
router.post('/user/:id/orders', authenticateToken, setUserOrder);
router.delete('/user/:id/cart', authenticateToken, emptyCart);
router.get('/user/:id/orders', authenticateToken, viewUserOrders);
router.get('/order/:orderItemId', authenticateToken, getOrderItemById);
router.get('/orders/:id', authenticateToken, getAllUserOrders);
router.get('/orders', authenticateToken, getAllUsersOrders);
router.put('/orders/:userId/items/:itemId', authenticateToken, updateOrderItemStatus);

module.exports = router;
