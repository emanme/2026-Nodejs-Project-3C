const { getConn } = require('./config/db');
const { userModel } = require('./models/userModel');
const { orderModel } = require('./models/orderModel');

async function test() {
  try {
    const conn = await getConn();
    console.log('DB connected!');
    await conn.end();

    // Test userModel
    const user = await userModel.findById(1);
    console.log('User with ID 1:', user);

    // Test orderModel
    const orders = await orderModel.listByUser(1);
    console.log('Orders for user ID 1:', orders);

  } catch (err) {
    console.error('DB/Test Error:', err);
  }
}

test();