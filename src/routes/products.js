const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { list, create, update, remove } = require('../controllers/productController');

const router = express.Router();

// Schema for listing products with pagination & search
const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    q: z.string().optional().default('')
  })
});

// Schema for creating/updating products
const upsertSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().optional().default(''),
    price: z.coerce.number(),
    stock: z.coerce.number().int().min(0),
    image_url: z.string().url().optional().nullable()
  }),
  params: z.object({
    id: z.coerce.number().int().min(1).optional()
  })
});

// Product routes
router.get('/', validate(listSchema), list);        // List products
router.post('/', auth, validate(upsertSchema), create); // Create product
router.put('/:id', auth, validate(upsertSchema), update); // Update product
router.delete('/:id', auth, validate(z.object({ params: z.object({ id: z.coerce.number().int().min(1) }) })), remove); // Delete product

module.exports = router;