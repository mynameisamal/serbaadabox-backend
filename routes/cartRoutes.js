const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCartByEmail);         // ambil cart by email
router.post('/', cartController.addToCart);             // tambah cart
router.delete('/:id', cartController.deleteCartItem);   // hapus satu
router.delete('/', cartController.clearCartByUser);     // hapus semua

module.exports = router;
