const { getConn } = require('./config/db');

async function test() {
  try {
    const conn = await getConn();
    console.log('DB connected!');
    await conn.end();
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
}

test();