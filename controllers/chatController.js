const db = require('../config/db');

// ✅ Ambil semua email unik yang pernah chat (untuk admin)
async function getAllChats(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT email, MAX(created_at) AS last_message
      FROM messages
      GROUP BY email
      ORDER BY last_message DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil daftar chat:', err);
    res.status(500).json({ message: 'Gagal ambil daftar chat.' });
  }
}

// ✅ Ambil seluruh pesan berdasarkan email (untuk admin & client)
async function getMessages(req, res) {
  const email = req.params.email || req.query.email;

  if (!email) return res.status(400).json({ message: 'Email tidak valid' });

  try {
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE email = ? ORDER BY created_at ASC',
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil pesan:', err);
    res.status(500).json({ message: 'Gagal ambil pesan' });
  }
}

// ✅ Kirim pesan dari client (pengunjung)
async function sendMessage(req, res) {
  const { email, content } = req.body;

  if (!email || !content) {
    return res.status(400).json({ message: 'Email dan isi pesan wajib diisi.' });
  }

  try {
    await db.query(
      'INSERT INTO messages (email, sender, content) VALUES (?, ?, ?)',
      [email, 'user', content]
    );
    res.status(201).json({ message: 'Pesan berhasil dikirim' });
  } catch (err) {
    console.error('❌ Gagal kirim pesan:', err);
    res.status(500).json({ message: 'Gagal kirim pesan.' });
  }
}

// ✅ Kirim pesan dari admin
async function sendAdminMessage(req, res) {
  console.log('📨 Body admin kirim:', req.body);

  const { email, content } = req.body;

  if (!email || !content) {
    return res.status(400).json({ message: 'Email dan isi pesan wajib diisi.' });
  }

  try {
    await db.query(
      'INSERT INTO messages (email, sender, content) VALUES (?, ?, ?)',
      [email, 'admin', content]
    );
    res.status(201).json({ message: 'Pesan admin berhasil dikirim' });
  } catch (err) {
    console.error('❌ Gagal kirim pesan admin:', err);
    res.status(500).json({ message: 'Gagal kirim pesan dari admin.' });
  }
}

// GET /api/chat/unread-count
async function getUnreadCount(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) as count
      FROM messages
      WHERE sender = 'user' AND is_read = FALSE
    `);
    res.json({ unread: rows[0].count });
  } catch (err) {
    console.error('Gagal hitung pesan belum dibaca:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ✅ Ambil daftar user yang pernah kirim chat (khusus admin)
async function getChatUsers(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT email FROM messages ORDER BY email
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil user chat:', err);
    res.status(500).json({ message: 'Gagal ambil user chat' });
  }
}

// PATCH /api/chat/:email/read
async function markMessagesAsRead(req, res) {
  const { email } = req.params;
  try {
    await db.query(
      `UPDATE messages SET is_read = TRUE WHERE email = ? AND sender = 'user'`,
      [email]
    );
    res.json({ message: 'Pesan ditandai sebagai dibaca' });
  } catch (err) {
    console.error('❌ Gagal update is_read:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllChats,
  getMessages,
  sendMessage,
  sendAdminMessage,
  getChatUsers,
  markMessagesAsRead,
  getUnreadCount,
};