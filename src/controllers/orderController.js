// src/controllers/orderController.js
const { orderModel } = require('../models/orderModel');

// List orders for the logged-in user
async function list(req, res) {
  try {
    const userId = req.user.id; // restore auth
    const orders = await orderModel.listByUser(userId);
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

// Create a new order
async function create(req, res) {
  try {
    const userId = req.user.id; // restore auth
    const { items } = req.body;
    const order = await orderModel.create(userId, items);
    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}

module.exports = { list, create };