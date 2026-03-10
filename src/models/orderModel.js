const { getConn } = require('../config/db');
const { productModel } = require('./productModel');

const orderModel = {
  // ISSUE-0005: order total computed incorrectly (quantity ignored)
  // ISSUE-0012: product stock not updated after order
  async create(userId, items) {
    let total = 0;
    const conn = await getConn();
    try {
      await conn.beginTransaction();

      for (const it of items) {
        const p = await productModel.findById(it.product_id);
        if (!p) throw new Error(`Product not found: ${it.product_id}`);

        // ISSUE-0009: missing robust validation for orders
        if (it.quantity < 0) throw new Error(`Invalid quantity for product ${it.product_id}`);

        total += Number(p.price) * it.quantity;

        // BUG: stock not updated
      }

      const [orderRes] = await conn.query(
        `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
        [userId, total]
      );
      const orderId = orderRes.insertId;

      for (const it of items) {
        const p = await productModel.findById(it.product_id);
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
          [orderId, it.product_id, it.quantity, p.price]
        );
      }

      await conn.commit();
      return { id: orderId, user_id: userId, total, items };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.end();
    }
  },

  // ISSUE-0034: Optimized product/order query to remove N+1 problem
  async listByUser(userId) {
    const conn = await getConn();
    try {
      // Single JOIN query to get all orders + order items
      const [rows] = await conn.query(
        `SELECT 
            o.id AS order_id,
            o.user_id,
            o.total,
            o.created_at,
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.unit_price
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ?
         ORDER BY o.id DESC`,
        [userId]
      );

      // Group order items by order_id
      const grouped = {};
      for (const row of rows) {
        if (!grouped[row.order_id]) {
          grouped[row.order_id] = {
            id: row.order_id,
            user_id: row.user_id,
            total: row.total,
            created_at: row.created_at,
            items: []
          };
        }
        if (row.product_id) {
          grouped[row.order_id].items.push({
            product_id: row.product_id,
            name: row.product_name,
            quantity: row.quantity,
            unit_price: row.unit_price
          });
        }
      }

      return Object.values(grouped);
    } finally {
      await conn.end();
    }
  }
};

module.exports = { orderModel };