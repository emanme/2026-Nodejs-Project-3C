// src/routes/products.js
import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { list, create, update, remove } from '../controllers/productController.js';

const router = express.Router();

// Schema for listing products with pagination
const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    q: z.string().optional().default('')
  })
});

// Schema for creating/updating a product
const upsertSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().optional().default(''), // ISSUE-0025,
    price: z.coerce.number().positive(), // ISSUE-0003 fixed - rejects zero and negative prices,
    stock: z.coerce.number().int().min(0),
    image_url: z.string().url().optional().nullable()
  }),
  params: z.object({
    id: z.coerce.number().int().min(1).optional()
  })
});

// Routes
router.get('/', validate(listSchema), list);
router.post('/', validate(upsertSchema), create); 
router.put('/:id', validate(upsertSchema), update);
router.delete(
  '/:id',
  validate(
    z.object({
      params: z.object({
        id: z.coerce.number().int().min(1)
      })
    })
  ),
  remove
);

export default router;