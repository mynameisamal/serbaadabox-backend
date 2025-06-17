const db = require('../config/db');

// Ambil semua item cart milik user (berdasarkan email)
async function getCartByEmail(req, res) {
  const { email } = req.query;
  try {
    const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const [items] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user.id]);
    res.json(items);
  } catch (error) {
    console.error('Gagal ambil cart:', error);
    res.status(500).json({ message: 'Gagal mengambil data cart' });
  }
}

// Tambahkan item ke cart
async function addToCart(req, res) {
  try {
    console.log('Add to cart body:', req.body);

    const { email, product_name, material, size, quantity, price, template } = req.body;

    if (!email || !product_name || !quantity || !price) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const [result] = await db.query(
      `INSERT INTO carts (user_id, product_name, material, size, quantity, price, template)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, product_name, material, size, quantity, price, template]
    );

    const [[newItem]] = await db.query('SELECT * FROM carts WHERE id = ?', [result.insertId]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Gagal tambah cart:', error);
    res.status(500).json({ message: 'Gagal menambahkan ke cart' });
  }
}

// Hapus 1 item dari cart berdasarkan id cart
async function deleteCartItem(req, res) {
  try {
    await db.query('DELETE FROM carts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item cart dihapus' });
  } catch (error) {
    console.error('Gagal hapus item cart:', error);
    res.status(500).json({ message: 'Gagal menghapus item cart' });
  }
}

// Hapus semua item cart milik user (berdasarkan email)
async function clearCartByUser(req, res) {
  const { email } = req.query;
  try {
    const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    await db.query('DELETE FROM carts WHERE user_id = ?', [user.id]);
    res.json({ message: 'Semua item cart dihapus' });
  } catch (error) {
    console.error('Gagal kosongkan cart:', error);
    res.status(500).json({ message: 'Gagal menghapus semua item cart' });
  }
}

module.exports = {
  getCartByEmail,
  addToCart,
  deleteCartItem,
  clearCartByUser,
};