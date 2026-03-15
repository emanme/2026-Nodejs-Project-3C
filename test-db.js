// test-db.js
import mysql from 'mysql2/promise';

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'store_user',
      password: '0013onita',
      database: 'simple_store'
    });

    console.log('Connected successfully!');
    await conn.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();