const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// CREATE ORDER
async function createOrder(req, res) {
  const { user: email, info, items, total } = req.body;

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const name = info.name || user.name;
    const address = info.address || user.address;
    const note = info.note || '';
    const phone = user.phone || '';

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, name, address, phone, note, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, name, address, phone, note, total, 'diproses']
    );

    const orderId = orderResult.insertId;

    const itemPromises = items.map(item => {
      return db.query(
        'INSERT INTO order_items (order_id, product_id, material, size, quantity, price, template) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          orderId,
          item.product_id || null,
          item.material || '',
          item.size || '',
          item.quantity || 1,
          item.price || 0,
          item.template || ''
        ]
      );
    });

    await Promise.all(itemPromises);

    res.status(201).json({ id: orderId });

  } catch (error) {
    console.error('Error saat membuat pesanan:', error);
    res.status(500).json({ message: 'Gagal membuat pesanan.' });
  }
}

// GET ORDER BY USER EMAIL
async function getOrdersByUser(req, res) {
  try {
    const { email } = req.query;
    console.log("🔍 Email yang diterima:", email);

    const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    console.log("✅ User ditemukan:", user);

    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
    console.log("📦 Orders milik user:", orders.map(o => ({ id: o.id, user_id: o.user_id })));

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map(o => o.id);

    let items = [];
    if (orderIds.length > 0) {
      const [fetchedItems] = await db.query(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );
      items = fetchedItems;
    }

    const result = orders.map(order => ({
      ...order,
      info: {
        name: order.name,
        address: order.address,
        note: order.note
      },
      items: items.filter(item => item.order_id === order.id)
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ Gagal ambil order:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat ambil order' });
  }
}

// GET ORDER BY ID
async function getOrderById(req, res) {
  const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
  res.json({ order: orders[0], items });
}

// GET ALL ORDERS
async function getAllOrders(req, res) {
  const [orders] = await db.query(`
    SELECT o.*, u.name AS customer_name, u.email 
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);
  res.json(orders);
}

// ✅ UPDATE ORDER STATUS + AUTO NOTIFICATION
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

  const [[order]] = await db.query('SELECT user_id FROM orders WHERE id = ?', [id]);
  if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

  const userId = order.user_id;

  let message = '';
  if (status === 'Diproses') message = `Pesanan #${id} sedang diproses.`;
  else if (status === 'Dikirim') message = `Pesanan #${id} telah dikirim.`;
  else if (status === 'Selesai') message = `Pesanan #${id} selesai.`;
  else message = `Status pesanan #${id} diperbarui menjadi ${status}.`;

  // ✅ Insert notifikasi dengan status 'unread' dan waktu NOW()
  await db.query(
    `INSERT INTO notifications (user_id, type, message, status, created_at)
     VALUES (?, ?, ?, 'unread', NOW())`,
    [userId, `Status ${status}`, message]
  );

  console.log(`📬 Notifikasi berhasil dikirim ke user_id ${userId} dengan status 'unread'`);

  res.json({ message: 'Status & notifikasi berhasil diperbarui' });
}

// UPLOAD BUKTI TRANSFER
async function uploadPaymentProof(req, res) {
  const orderId = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: 'File tidak ditemukan' });
  }

  const filePath = req.file.filename;

  try {
    await db.query('UPDATE orders SET payment_proof = ? WHERE id = ?', [filePath, orderId]);
    res.json({ message: 'Bukti transfer berhasil diupload', file: filePath });
  } catch (err) {
    console.error('Gagal upload bukti transfer:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ✅ PATCH /orders/:id/payment-status
async function updatePaymentStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['valid', 'invalid'].includes(status)) {
    return res.status(400).json({ message: 'Status pembayaran tidak valid' });
  }

  try {
    await db.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [status, id]
    );
    res.json({ message: 'Status pembayaran berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal memperbarui status pembayaran:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  uploadPaymentProof,
  updatePaymentStatus
};