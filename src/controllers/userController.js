const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { apiError } = require('../utils/errors');
const { userModel } = require('../models/userModel');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // ISSUE-0011 fixed: token now expires
  );
}

async function register(req, res) {
  try { // ISSUE-0006 fixed: added try/catch
    const { email, name, password } = req.validated.body;
    const existing = await userModel.findByEmail(email);
    if (existing) return apiError(res, 409, 'CONFLICT', 'Email already in use'); // ISSUE-0002 fixed
    const password_hash = await bcrypt.hash(password, 10); // ISSUE-0001 fixed: hash password
    const user = await userModel.create({ email, name, password_hash, role: 'customer' });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role }); // ISSUE-0013 fixed: 201
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.validated.body;
    const user = await userModel.findByEmail(email);
    if (!user) return apiError(res, 401, 'AUTH', 'Invalid credentials'); // ISSUE-0013 fixed: 401
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return apiError(res, 401, 'AUTH', 'Invalid credentials');
    const token = signToken(user);
    return res.status(200).json({ token });
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

async function me(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return apiError(res, 404, 'NOT_FOUND', 'User not found');
    const { password_hash, ...safeUser } = user; // ISSUE-0010 fixed: exclude password
    return res.json(safeUser);
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

// ISSUE-0017 fixed: added missing user endpoint functions
async function list(req, res) {
  try {
    const users = await userModel.findAll();
    const safe = users.map(({ password_hash, ...u }) => u);
    return res.status(200).json(safe);
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

async function getById(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return apiError(res, 404, 'NOT_FOUND', 'User not found');
    const { password_hash, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

async function update(req, res) {
  try {
    const { name, email } = req.validated.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return apiError(res, 404, 'NOT_FOUND', 'User not found');
    const updated = await userModel.update(req.params.id, { name, email });
    return res.status(200).json(updated);
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

async function destroy(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return apiError(res, 404, 'NOT_FOUND', 'User not found');
    await userModel.remove(req.params.id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    return apiError(res, 500, 'SERVER_ERROR', e.message);
  }
}

module.exports = { register, login, me, list, getById, update, destroy };