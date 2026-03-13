const mysql = require('mysql2/promise');

// Load environment variables
const CFG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'store_user',
  password: process.env.DB_PASS || 'store_pass',
  database: process.env.DB_NAME || 'store_db',
};

async function getConn() {
  return mysql.createConnection(CFG);
}

module.exports = { getConn };