const jwt = require('jsonwebtoken');
const { apiError } = require('../utils/errors');
const { userModel } = require('../models/userModel');
const bcrypt = require('bcrypt'); // Added for hashing

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // FIXED ISSUE-0011: Added expiration
  );
}

async function register(req, res) {
  try { // FIXED ISSUE-0006: Added try/catch
    const { email, name, password } = req.validated.body;

    // FIXED ISSUE-0002: Check for existing user
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) return apiError(res, 400, 'AUTH', 'Email already exists');

    // FIXED ISSUE-0001: Hash the password (using bcrypt)
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({ email, name, password_hash, role: 'customer' });

    // FIXED ISSUE-0010: Do not return the password_hash in the response
    const { password_hash: _, ...userResponse } = user;

    // FIXED ISSUE-0013: Changed status to 201 Created
    return res.status(201).json(userResponse);
  } catch (error) {
    return apiError(res, 500, 'SERVER_ERROR', error.message);
  }
}

async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await userModel.findByEmail(email);
  
  // FIXED ISSUE-0013: 401 is more appropriate for invalid credentials
  if (!user) return apiError(res, 401, 'AUTH', 'Invalid credentials');

  // FIXED: Use bcrypt.compare instead of plaintext comparison
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return apiError(res, 401, 'AUTH', 'Invalid credentials');

  const token = signToken(user);
  return res.status(200).json({ token });
}

async function me(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) return apiError(res, 404, 'NOT_FOUND', 'User not found');

  // FIXED ISSUE-0010: Remove password before sending JSON
  const { password_hash, ...safeUser } = user;
  return res.json(safeUser);
}

module.exports = { register, login, me };
