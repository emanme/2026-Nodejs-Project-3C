// src/routes/orders.js
import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { create, list } from '../controllers/orderController.js';

const router = express.Router();

// Schema for creating an order
const createSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        product_id: z.coerce.number().int().min(1),
        quantity: z.coerce.number().int().min(1)
      })
    ).min(1)
  })
});

// Routes
router.post('/', auth, validate(createSchema), create); // ISSUE-0020 + ISSUE-0009
router.get('/', auth, list);

export default router;