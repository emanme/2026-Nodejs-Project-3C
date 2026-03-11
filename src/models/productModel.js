const { getConn } = require('../config/db');

const productModel = {
  // Fetch a single product by ID
  async findById(id) {
    const conn = await getConn();
    try {
      const [rows] = await conn.query(
        'SELECT id, name, price, stock FROM products WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      await conn.end();
    }
  },

  // Fetch multiple products by array of IDs
  async findByIds(ids) {
    if (!ids.length) return [];
    const conn = await getConn();
    try {
      const [rows] = await conn.query(
        `SELECT id, name, price, stock FROM products WHERE id IN (?)`,
        [ids]
      );
      return rows;
    } finally {
      await conn.end();
    }
  },

  // Optimized list query (used by controller)
  async list({ page = 1, limit = 10, q = '' }) {
    const conn = await getConn();
    try {
      const offset = (page - 1) * limit;

      const [rows] = await conn.query(
        `SELECT id, name, price, stock
         FROM products
         WHERE name LIKE ?
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [`%${q}%`, Number(limit), Number(offset)]
      );

      return rows;
    } finally {
      await conn.end();
    }
  }
};

module.exports = { productModel };