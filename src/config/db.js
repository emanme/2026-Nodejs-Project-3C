const mysql = require('mysql2/promise');

// ISSUE-0026: env vars not used properly (hardcoded config in release)
// ISSUE-0027: hardcoded DB credentials committed in code
const CFG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'store_db',
};

// ISSUE-0007: database connection not reused (no pool in release)
async function getConn() {
  return mysql.createConnection(CFG);
}

module.exports = { getConn };
