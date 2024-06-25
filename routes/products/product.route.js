const express = require('express');
const router = express.Router();
const { addProduct, upload, allProducts, removeProduct, viewProduct, updateProduct, viewProduct2 } = require('../../controllers/products/product.controller');
const authenticateToken = require('../../helper/authenticateToken/authenticateToken');

// Define routes
router.post('/add-product', authenticateToken, upload.array('images'), addProduct);
router.get('/products', authenticateToken, allProducts);
router.delete('/remove-product/:id', authenticateToken, removeProduct);
router.get('/view-product/:productId', authenticateToken, viewProduct);
router.get('/products/:id', authenticateToken, viewProduct2);
router.put('/update-product/:id', authenticateToken, upload.array('images'), updateProduct);

module.exports = router;
