// src/config/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',       // XAMPP localhost
  user: 'store_user',       // MySQL user
  password: '0013onita',    // MySQL password
  database: 'simple_store', // Database name
  multipleStatements: true  // Allow multiple CREATE TABLE statements
});

// helper to get a connection from the pool
export async function getConn() {
  return pool.getConnection();
}

// export pool for queries if needed
export { pool };