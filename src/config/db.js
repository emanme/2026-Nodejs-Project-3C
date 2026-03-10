const mysql = require('mysql2/promise');
require('dotenv').config(); // load .env

const CFG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simple_store',
};

// Create a database connection
async function getConn() {
  return mysql.createConnection(CFG);
}

module.exports = { getConn };