const mysql = require('mysql2/promise');

// ISSUE-0026 fixed: use environment variables
// ISSUE-0027 fixed: removed hardcoded credentials
// ISSUE-0007 fixed: use connection pool instead of new connection each time
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function getConn() {
  return pool.getConnection();
}

module.exports = { getConn };