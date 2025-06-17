const db = require('../config/db');

// Ringkasan utama: total order, pendapatan, pelanggan
async function getSummaryStats(req, res) {
  const [[orders]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
  const [[revenue]] = await db.query('SELECT SUM(total) AS totalRevenue FROM orders');
  const [[customers]] = await db.query('SELECT COUNT(DISTINCT user_id) AS totalCustomers FROM orders');

  res.json({
    totalOrders: orders.totalOrders,
    totalRevenue: revenue.totalRevenue || 0,
    totalCustomers: customers.totalCustomers
  });
}

// Penjualan 7 hari terakhir
async function getDailySales(req, res) {
  const [rows] = await db.query(`
    SELECT DATE(created_at) AS date, SUM(total) AS total
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 7
  `);
  res.json(rows);
}

// Produk terlaris (berdasarkan jumlah quantity)
async function getTopProducts(req, res) {
  const [rows] = await db.query(`
    SELECT p.name, SUM(oi.quantity) AS count
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY oi.product_id
    ORDER BY count DESC
    LIMIT 5
  `);
  res.json(rows);
}

// Pelanggan yang repeat order
async function getRepeatCustomers(req, res) {
  const [rows] = await db.query(`
    SELECT u.email, COUNT(o.id) AS count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    GROUP BY o.user_id
    HAVING count > 1
    ORDER BY count DESC
  `);
  res.json(rows);
}

module.exports = {
  getSummaryStats,
  getDailySales,
  getTopProducts,
  getRepeatCustomers
};
