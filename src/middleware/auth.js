// src/middleware/auth.js
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ 
      status: '401 Unauthorized',
      error: { code: 'UNAUTH', message: 'No token provided' } 
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ 
      error: { code: 'UNAUTH', message: 'Invalid or expired token' } 
    });
  }
}