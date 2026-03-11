const { orderModel } = require('./src/models/orderModel');
const { productModel } = require('./src/models/productModel');

async function test() {
  try {
    const products = await productModel.list({ page: 1, limit: 100 });
    console.log('All Products:');
    console.log(products);

    const orders = await orderModel.listByUser(1);
    console.log('\nOrders for user 1:');
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error fetching products or orders:', err);
  }
}

test();