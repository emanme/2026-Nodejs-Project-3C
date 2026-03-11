const { getConn } = require('../config/db');

const userModel = {
  async findByEmail(email) {
    const conn = await getConn();
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0] || null;
    } finally {
      await conn.release();
    }
  },

  async findById(id) {
    const conn = await getConn();
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    } finally {
      await conn.release();
    }
  },

  async create({ email, name, password_hash, role }) {
    const conn = await getConn();
    try {
      const [r] = await conn.query(
        'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
        [email, name, password_hash, role]
      );
      return { id: r.insertId, email, name, role };
    } finally {
      await conn.release();
    }
  },

  // ISSUE-0017 fixed: added missing functions
  async findAll() {
    const conn = await getConn();
    try {
      const [rows] = await conn.query('SELECT * FROM users');
      return rows;
    } finally {
      await conn.release();
    }
  },

  async update(id, { name, email }) {
    const conn = await getConn();
    try {
      await conn.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
      return await this.findById(id);
    } finally {
      await conn.release();
    }
  },

  async remove(id) {
    const conn = await getConn();
    try {
      await conn.query('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      await conn.release();
    }
  }
};

module.exports = { userModel };