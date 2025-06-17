const db = require('../config/db');

async function getAllTemplates(req, res) {
  const [rows] = await db.query('SELECT * FROM templates ORDER BY id DESC');
  res.json(rows);
}

async function createTemplate(req, res) {
  const { name, description, category, price, size } = req.body;
  const image_url = req.file ? req.file.filename : null;

  const [result] = await db.query(
    'INSERT INTO templates (name, description, category, price, size, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, category, price, size, image_url]
  );

  res.status(201).json({ id: result.insertId });
}

async function updateTemplate(req, res) {
  const { id } = req.params;
  const { name, description, category, price, size } = req.body;
  const image_url = req.file ? req.file.filename : req.body.existing_image_url;

  try {
    await db.query(
      'UPDATE templates SET name=?, description=?, category=?, price=?, size=?, image_url=? WHERE id=?',
      [name, description, category, price, size, image_url, id]
    );

    const [[updated]] = await db.query('SELECT * FROM templates WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error('Gagal update template:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteTemplate(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM templates WHERE id = ?', [id]);
    res.json({ message: 'Template berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus template:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};