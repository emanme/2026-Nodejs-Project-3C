// src/controllers/productController.js
import { productModel } from '../models/productModel.js';

export async function list(req, res) {
  const { page, limit, q } = req.validated.query;
  const result = await productModel.list({ page, limit, q });
  return res.json(result);
}

export async function create(req, res) {
  const p = await productModel.create(req.validated.body);
  return res.status(201).json(p); // fixed ISSUE-0013: 201 for creation
}

export async function update(req, res) {
  const { id } = req.validated.params;
  const p = await productModel.update(id, req.validated.body);
  if (!p) return res.status(404).json({ error: 'Product not found' }); // standardized
  return res.json(p);
}

export async function remove(req, res) {
  const id = Number(req.params.id); // fixed param
  const ok = await productModel.remove(id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  return res.status(204).send(); // fixed ISSUE-0013: 204 No Content
}