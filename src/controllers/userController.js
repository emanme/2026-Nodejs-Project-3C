// src/controllers/userController.js
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';

// Helper to sign JWT
function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
}

// Helper to send error responses consistently
function sendError(res, code, statusText, message) {
  return res.status(code).json({
    status: statusText,
    message
  });
}

// -----------------------------
// Controller Functions
// -----------------------------

// Register new user
export async function register(req, res) {
  const { email, name, password } = req.validated.body;

  if (!email || !name || !password) {
    return sendError(res, 400, "400 Bad Request", "Email, name, and password are required");
  }

  try {
    const user = await userModel.create({ email, name, password_hash: password, role: 'customer' });

    return res.status(201).json({
      status: "201 Created",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "500 Internal Server Error", "Server error");
  }
}

// Login user
export async function login(req, res) {
  const { email, password } = req.validated.body;

  try {
    const user = await userModel.findByEmail(email);
    if (!user) return sendError(res, 401, "401 Unauthorized", "Invalid credentials");

    const ok = password === user.password_hash; // plaintext in release
    if (!ok) return sendError(res, 401, "401 Unauthorized", "Invalid credentials");

    const token = signToken(user);
    return res.status(200).json({
      status: "200 OK",
      token
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "500 Internal Server Error", "Server error");
  }
}

// Get current authenticated user info
export async function me(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return sendError(res, 404, "404 Not Found", "User not found");

    return res.status(200).json({
      status: "200 OK",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "500 Internal Server Error", "Server error");
  }
}

// Get user by ID
export async function getUserById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendError(res, 400, "400 Bad Request", "Invalid user ID");

  try {
    const user = await userModel.findById(id);
    if (!user) return sendError(res, 404, "404 Not Found", "User not found");

    return res.status(200).json({
      status: "200 OK",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "500 Internal Server Error", "Server error");
  }
}