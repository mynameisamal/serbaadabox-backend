const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const upload = require('../middlewares/uploadProductImage'); // ✅ middleware multer

router.get('/', getAllProducts);                // GET semua produk
router.get('/:id', getProductById);             // GET produk by ID
router.post('/', upload.single('photo'), createProduct);    // POST produk dengan upload foto
router.put('/:id', upload.single('photo'), updateProduct);  // PUT produk dengan upload foto baru (opsional)
router.delete('/:id', deleteProduct);           // DELETE produk

module.exports = router;