# Seeded Issues (Release Branch)

> In the `release` branch, each issue is tagged in code as `ISSUE-####`.

## 35 issues

0001 Password not hashed during registration (stores plaintext)
0002 Duplicate email allowed on registration
0003 Product price accepts negative values
0004 Product create/update/delete missing authentication
0005 Order total computed incorrectly (quantity ignored)
0006 Missing try/catch / error handling in user controller
0007 Database connection not reused (no pool)
0008 Password policy too weak (accepts 1-char)
0009 Missing input validation for orders
0010 Users endpoint leaks password field
0011 JWT expiration not implemented (tokens never expire)
0012 Product stock not updated after order
0013 Wrong HTTP status codes in several endpoints
0014 Products list has no pagination
0015 Product search endpoint missing
0016 Error responses not standardized
0017 Missing GET user by ID (admin-only) OR route returns wrong user
0018 Delete product route broken (wrong param)
0019 Add product image_url field (schema + model + response)
0020 Validation middleware not used consistently
0021 Order date not stored/returned explicitly
0022 API documentation missing details
0023 Missing request logging middleware
0024 Server can crash on invalid JSON body
0025 Product category missing (schema + validation)
0026 Environment variables not used (hardcoded config)
0027 Hardcoded DB credentials committed
0028 Add rate limiter to auth routes
0029 Password reset feature missing
0030 Improve error stack logging (dev-only)
0031 CORS policy misconfigured (too open)
0032 Add API versioning (/api/v1)
0033 Missing unit tests (minimum smoke tests)
0034 Optimize product query (inefficient pattern)
0035 Add health check endpoint (missing in release)

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

Most endpoints require a JWT token in the header:

```
Authorization: Bearer <token>
```

---

### Users

| Method | Endpoint        | Description             | Auth |
| ------ | --------------- | ----------------------- | ---- |
| POST   | /users/register | Register a new user     | No   |
| POST   | /users/login    | Login and get JWT token | No   |
| GET    | /users/:id      | Get user by ID          | Yes  |

---

### Products

| Method | Endpoint      | Description                                           | Auth |
| ------ | ------------- | ----------------------------------------------------- | ---- |
| GET    | /products     | Get all products (supports ?page=1&limit=10&q=search) | No   |
| GET    | /products/:id | Get product by ID                                     | No   |
| POST   | /products     | Create a new product                                  | Yes  |
| PUT    | /products/:id | Update a product                                      | Yes  |
| DELETE | /products/:id | Delete a product                                      | Yes  |

---

### Orders

| Method | Endpoint    | Description        | Auth |
| ------ | ----------- | ------------------ | ---- |
| GET    | /orders     | Get all orders     | Yes  |
| GET    | /orders/:id | Get order by ID    | Yes  |
| POST   | /orders     | Create a new order | Yes  |

---

### Example Requests

**Register:**

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@email.com","password":"pass123"}'
```

**Get Products with Pagination:**

```bash
curl "http://localhost:3000/products?page=1&limit=5"
```

**Create Product (with auth):**

```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","category":"Electronics","price":999.99,"stock":10}'
```
