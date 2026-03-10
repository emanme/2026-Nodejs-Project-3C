const { productModel } = require('../models/productModel');

// List products
async function list(req, res) {
  try {
    const { page, limit, q } = req.query;
    const result = await productModel.list({ page, limit, q });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// Create product
async function create(req, res) {
  try {
    const product = await productModel.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

// Update product
async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await productModel.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// Delete product
async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = await productModel.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = { list, create, update, remove };