const db = require('../config/db');

// Ambil semua notifikasi terbaru
async function getNotifications(req, res) {
  const [rows] = await db.query(`
    SELECT n.*, u.email 
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    ORDER BY n.created_at DESC
  `);
  res.json(rows);
}

// Buat notifikasi baru
async function createNotification(req, res) {
  const { user_id, type, message } = req.body;
  const status = 'unread';
  await db.query(
    'INSERT INTO notifications (user_id, type, message, status) VALUES (?, ?, ?, ?)',
    [user_id, type, message, status]
  );
  res.status(201).json({ message: 'Notifikasi berhasil dibuat' });
}

// Tandai notifikasi sebagai dibaca
async function markAsRead(req, res) {
  const id = req.params.id;
  await db.query('UPDATE notifications SET status = ? WHERE id = ?', ['read', id]);
  res.json({ message: 'Notifikasi ditandai sebagai dibaca' });
}

// Hapus satu notifikasi
async function deleteNotification(req, res) {
  const { id } = req.params;
  await db.query('DELETE FROM notifications WHERE id = ?', [id]);
  res.json({ message: 'Notifikasi dihapus' });
}

// Hapus semua notifikasi
async function deleteAllNotifications(req, res) {
  await db.query('DELETE FROM notifications');
  res.json({ message: 'Semua notifikasi dihapus' });
}

// Ambil notifikasi berdasarkan email user
async function getNotificationsByEmail(req, res) {
  const { email } = req.query;

  try {
    const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Gagal ambil notifikasi:', err);
    res.status(500).json({ message: 'Gagal ambil notifikasi' });
  }
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationsByEmail
};
