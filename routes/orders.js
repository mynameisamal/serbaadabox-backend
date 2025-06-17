const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // ✅ ubah jadi satu objek
const upload = require('../middlewares/uploadProof');

// ✨ Route khusus user berdasarkan email
router.get('/', (req, res) => {
  if (req.query.email) {
    return orderController.getOrdersByUser(req, res); // ✅ gunakan orderController di semua handler
  } else {
    return orderController.getAllOrders(req, res);
  }
});

router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.post('/:id/payment', upload.single('file'), orderController.uploadPaymentProof);
router.patch('/:id/payment-status', orderController.updatePaymentStatus);

module.exports = router;