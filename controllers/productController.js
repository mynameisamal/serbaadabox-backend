const db = require('../config/db');

async function getAllProducts(req, res) {
  const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
  res.json(rows);
}

async function getProductById(req, res) {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json(rows[0]);
}

async function createProduct(req, res) {
  const { name, category, price, stock } = req.body;
  const photo_url = req.file ? req.file.filename : null;

  const [result] = await db.query(
    'INSERT INTO products (name, category, price, stock, photo_url) VALUES (?, ?, ?, ?, ?)',
    [name, category, price, stock, photo_url]
  );
  res.status(201).json({ id: result.insertId });
}

async function updateProduct(req, res) {
  const { name, price, stock, category } = req.body;
  const { id } = req.params;

  const photo_url = req.file ? req.file.filename : req.body.existing_photo_url;

  await db.query(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ?, photo_url = ? WHERE id = ?',
    [name, price, stock, category, photo_url, id]
  );

  const [[updated]] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  res.json(updated);
}

async function deleteProduct(req, res) {
  await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ message: 'Produk dihapus' });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
