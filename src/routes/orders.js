const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { create, list } = require('../controllers/orderController');

const router = express.Router();

// Schema for validating order creation
const createSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      product_id: z.coerce.number().int().min(1),
      quantity: z.coerce.number().int().min(1)
    })).min(1)
  })
});

// Routes
router.post('/', auth, validate(createSchema), create); // Create order
router.get('/', auth, list); // List orders by user

module.exports = router;