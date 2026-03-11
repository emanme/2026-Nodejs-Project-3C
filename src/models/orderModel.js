const { getConn } = require('../config/db');
const { productModel } = require('./productModel');

const orderModel = {
  // Create a new order
  async create(userId, items) {
    let total = 0;
    const conn = await getConn();
    try {
      await conn.beginTransaction();

      for (const it of items) {
        const product = await productModel.findById(it.product_id);
        if (!product) throw new Error(`Product not found: ${it.product_id}`);
        if (it.quantity < 0) throw new Error(`Invalid quantity for product ${it.product_id}`);

        total += product.price * it.quantity;
      }

      const [orderRes] = await conn.query(
        'INSERT INTO orders (user_id, total) VALUES (?, ?)',
        [userId, total]
      );
      const orderId = orderRes.insertId;

      for (const it of items) {
        const product = await productModel.findById(it.product_id);
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, it.product_id, it.quantity, product.price]
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

  // Fetch all orders for a user with products in a single query
  async listByUser(userId) {
    const conn = await getConn();
    try {
      const [rows] = await conn.query(
        `SELECT o.id AS order_id, o.user_id, o.total, o.created_at,
                oi.product_id, p.name, oi.quantity, oi.unit_price
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ?
         ORDER BY o.id DESC`,
        [userId]
      );

      // Group items by order
      const ordersMap = new Map();
      rows.forEach(row => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            id: row.order_id,
            user_id: row.user_id,
            total: row.total,
            created_at: row.created_at,
            items: []
          });
        }
        if (row.product_id) {
          ordersMap.get(row.order_id).items.push({
            product_id: row.product_id,
            name: row.name,
            quantity: row.quantity,
            unit_price: row.unit_price
          });
        }
      });

      return Array.from(ordersMap.values());
    } finally {
      await conn.end();
    }
  }
};

module.exports = { orderModel };