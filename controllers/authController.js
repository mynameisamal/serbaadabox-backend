const db = require('../config/db');

async function login(req, res) {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  const user = rows[0];
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}

async function register(req, res) {
  const { email, password, name } = req.body;
  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

  if (existing.length > 0) {
    return res.status(409).json({ message: 'Email sudah terdaftar' });
  }

  await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
  res.status(201).json({ message: 'Pendaftaran berhasil' });
}

// ✅ GET profil user by email
async function getProfile(req, res) {
  const { email } = req.query;
  const [[user]] = await db.query(
    'SELECT name, email, phone, address, note FROM users WHERE email = ?',
    [email]
  );
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  res.json(user);
}

// ✅ PATCH profil user
async function updateProfile(req, res) {
  const { email, name, phone, address, note } = req.body;
  const [result] = await db.query(
    'UPDATE users SET name = ?, phone = ?, address = ?, note = ? WHERE email = ?',
    [name, phone, address, note, email]
  );
  res.json({ message: 'Profil berhasil diperbarui' });
}

// ❓Opsional kalau tetap mau pakai untuk dashboard admin
async function getMe(req, res) {
  const { email } = req.query;
  const [rows] = await db.query('SELECT id, email, name, role, address, phone, note FROM users WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  res.json(rows[0]);
}

module.exports = {
  login,
  register,
  getMe,
  getProfile,
  updateProfile
};