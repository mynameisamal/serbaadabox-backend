const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // ganti sesuai pengaturanmu
  password: '',         // ganti sesuai pengaturanmu
  database: 'serbaadabox',
});

module.exports = pool.promise();
