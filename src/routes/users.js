const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { register, login, me, list, getById, update, destroy } = require('../controllers/userController');

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8) // ISSUE-0008 fixed: strong password policy
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional()
  })
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, me);

// ISSUE-0017 fixed: added missing user endpoints
router.get('/', auth, list);
router.get('/:id', auth, getById);
router.put('/:id', auth, validate(updateSchema), update);
router.delete('/:id', auth, destroy);

module.exports = router;