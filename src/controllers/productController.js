const { productModel } = require('../models/productModel');

const productController = {

  async list(req, res) {
    try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const q = req.query.q || '';

      const result = await productModel.list({ page, limit, q });

      res.json(result);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {

      const { name, category, price, stock, image_url } = req.body;

      const product = await productModel.create({
        name,
        category,
        price,
        stock,
        image_url
      });

      res.status(201).json(product);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {

      const id = req.params.id;

      const { name, category, price, stock, image_url } = req.body;

      const product = await productModel.update(id, {
        name,
        category,
        price,
        stock,
        image_url
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {

      const id = req.params.id;

      const success = await productModel.remove(id);

      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async findById(req, res) {
    try {

      const id = req.params.id;

      const product = await productModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

module.exports = { productController };