const { getConn } = require('../config/db');

const productModel = {
  // Fetch a single product by ID (only needed columns)
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

  // Fetch multiple products by array of IDs (optimized for create order)
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
  }
};

module.exports = { productModel };