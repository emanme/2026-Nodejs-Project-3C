// src/controllers/userController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from '../models/userModel.js';
import { apiError } from '../utils/errors.js';

// Helper to sign JWT
function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// -----------------------------
// Register User
// -----------------------------
export async function register(req, res) {
  try {
    const { email, name, password } = req.validated.body;

    // check existing user
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return apiError(res, 400, 'AUTH', 'Email already exists');
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // create user
    const user = await userModel.create({
      email,
      name,
      password_hash,
      role: 'customer'
    });

    // remove password before sending response
    const { password_hash: _, ...safeUser } = user;

    return res.status(201).json({
      status: "201 Created",
      data: safeUser
    });

  } catch (error) {
    console.error(error);
    return apiError(res, 500, 'SERVER_ERROR', error.message);
  }
}

// -----------------------------
// Login User
// -----------------------------
export async function login(req, res) {
  try {
    const { email, password } = req.validated.body;

    const user = await userModel.findByEmail(email);
    if (!user) {
      return apiError(res, 401, 'AUTH', 'Invalid credentials');
    }

    // compare hashed password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return apiError(res, 401, 'AUTH', 'Invalid credentials');
    }

    const token = signToken(user);

    return res.status(200).json({
      status: "200 OK",
      token
    });

  } catch (error) {
    console.error(error);
    return apiError(res, 500, 'SERVER_ERROR', error.message);
  }
}

// -----------------------------
// Get Current User
// -----------------------------
export async function me(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return apiError(res, 404, 'NOT_FOUND', 'User not found');
    }

    // remove password
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      status: "200 OK",
      data: safeUser
    });

  } catch (error) {
    console.error(error);
    return apiError(res, 500, 'SERVER_ERROR', error.message);
  }
}

// -----------------------------
// Get User By ID
// -----------------------------
export async function getUserById(req, res) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return apiError(res, 400, 'BAD_REQUEST', 'Invalid user ID');
    }

    const user = await userModel.findById(id);

    if (!user) {
      return apiError(res, 404, 'NOT_FOUND', 'User not found');
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      status: "200 OK",
      data: safeUser
    });

  } catch (error) {
    console.error(error);
    return apiError(res, 500, 'SERVER_ERROR', error.message);
  }
}