const { getConn } = require('../config/db');
const { productModel } = require('./productModel');

const orderModel = {
  // Create order with optimized product fetching
  async create(userId, items) {
    if (!items || !items.length) throw new Error('No items provided');

    const conn = await getConn();
    try {
      await conn.beginTransaction();

      // Fetch all products in one query
      const productIds = items.map(it => it.product_id);
      const products = await productModel.findByIds(productIds);
      const productMap = {};
      products.forEach(p => productMap[p.id] = p);

      let total = 0;

      for (const it of items) {
        const p = productMap[it.product_id];
        if (!p) throw new Error(`Product not found: ${it.product_id}`);
        if (it.quantity <= 0) throw new Error(`Invalid quantity for product ${it.product_id}`);
        total += Number(p.price) * it.quantity;

        // Update stock
        const newStock = p.stock - it.quantity;
        if (newStock < 0) throw new Error(`Insufficient stock for product ${p.name}`);
        await conn.query(
          `UPDATE products SET stock = ? WHERE id = ?`,
          [newStock, p.id]
        );
      }

      // Insert order
      const [orderRes] = await conn.query(
        `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
        [userId, total]
      );
      const orderId = orderRes.insertId;

      // Insert order items
      for (const it of items) {
        const p = productMap[it.product_id];
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
          [orderId, p.id, it.quantity, p.price]
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

  // Optimized listing of orders per user (no N+1 queries)
  async listByUser(userId) {
    const conn = await getConn();
    try {
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