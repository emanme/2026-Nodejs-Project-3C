// src/controllers/orderController.js
import { apiError } from '../utils/errors.js';
import { orderModel } from '../models/orderModel.js';

export async function create(req, res) {
  const { items } = req.validated.body;
  if (!items.length) return apiError(res, 400, 'VALIDATION', 'Order items required');

  try {
    const order = await orderModel.create(req.user.id, items);
    return res.status(201).json(order);
  } catch (e) {
    return apiError(res, 400, 'ORDER', e.message || 'Order failed');
  }
}

export async function list(req, res) {
  const orders = await orderModel.listByUser(req.user.id);
  return res.json({ orders });
}