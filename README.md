# Simple Store API (Node.js + Express + MySQL)

This repository is designed for **real-world Git workflow practice**.

## Branches
- `main` — production/stable
- `release` — upcoming version branch with **35 seeded issues** (bugs, missing features, and improvements)

## Student Workflow
1. Checkout `release`
2. Create a branch using:
   `####-lastname+initial-3word-description`
   Example: `0402-delacruzj-payment-verification-database`
3. Fix the assigned issue
4. Push and open PR → `release`

## Quick Start
```bash
npm install
docker compose up -d
cp .env.example .env
npm run db:init
npm run dev
```

## Main Endpoints
All endpoints are prefixed with `/api/v1`:

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users/me`
- `GET /api/v1/products` (pagination + search)
- `POST /api/v1/products` (auth)
- `PUT /api/v1/products/:id` (auth)
- `DELETE /api/v1/products/:id` (auth)
- `POST /api/v1/orders` (auth)
- `GET /api/v1/orders` (auth)
- `GET /api/v1/health`

## Release Issues
See **ISSUES.md**. In `release`, issues are tagged in code as `ISSUE-####`.

