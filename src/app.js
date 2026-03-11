require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const users = require('./routes/users');
const products = require('./routes/products');
const orders = require('./routes/orders');

const app = express();

// Security headers
app.use(helmet());

// CORS - safer: allow only specific origins (replace with your front-end URL)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', 
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// JSON parser with built-in Express middleware
app.use(express.json());

// Request logging
app.use(morgan('combined'));

// Routes
app.use('/users', users);
app.use('/products', products);
app.use('/orders', orders);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // log error stack
  res.status(500).json({ message: 'Server error', error: err.message });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on port ${port}`));