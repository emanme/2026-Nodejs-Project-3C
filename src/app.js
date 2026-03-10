// Load environment variables
import 'dotenv/config';

// Imports
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Routes (must include .js extension in ES Modules)
import users from './routes/users.js';
import products from './routes/products.js';
import orders from './routes/orders.js';

const app = express();

// Security middleware
app.use(helmet());

// ISSUE-0031: CORS too open in release
app.use(cors());

// ISSUE-0024: safe JSON parser (prevents crashes)
app.use(express.json({ strict: true }));

// ISSUE-0023: request logging missing in release (add morgan if desired)
// ISSUE-0028: rate limiter missing in release

// ISSUE-0035: /health endpoint missing in release

app.use('/users', users);
app.use('/products', products);
app.use('/orders', orders);

// ISSUE-0016/0030: error handling consistent
app.use((err, req, res, next) => {
  console.error(err); // log stack trace
  res.status(500).send('Server error');
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on port ${port}`));