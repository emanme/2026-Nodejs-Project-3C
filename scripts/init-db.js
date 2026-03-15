// scripts/init-db.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getConn } from '../src/config/db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  let conn;
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    conn = await getConn();

    // Run SQL file (multiple statements)
    await conn.query(sql);

    // Seed initial products
    const seed = [
      { name: 'USB-C Cable', category: 'Accessories', price: 199.0, stock: 50, image_url: null },
      { name: 'Wireless Mouse', category: 'Peripherals', price: 599.0, stock: 30, image_url: null },
      { name: 'Mechanical Keyboard', category: 'Peripherals', price: 1999.0, stock: 20, image_url: null }
    ];

    for (const p of seed) {
      await conn.query(
        `INSERT INTO products (name, category, price, stock, image_url)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE price=VALUES(price), stock=VALUES(stock)`,
        [p.name, p.category, p.price, p.stock, p.image_url]
      );
    }

    console.log('[db:init] OK');
  } catch (e) {
    console.error('[db:init] FAILED', e);
    process.exitCode = 1;
  } finally {
    if (conn) conn.release(); // release pooled connection safely
  }
})();