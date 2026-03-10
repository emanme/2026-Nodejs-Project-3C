// src/routes/users.js
import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { register, login, me, getUserById } from '../controllers/userController.js';

const router = express.Router();

// -----------------------------
// Validation Schemas
// -----------------------------

// Schema for registration
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(1) // ISSUE-0008 weak policy in release
  })
});

// Schema for login
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

// -----------------------------
// Routes
// -----------------------------

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', auth, me);
router.get('/:id', auth, getUserById); // NEW: get user by ID

export default router;