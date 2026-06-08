# Cartly

## Overview
Cartly is a fullstack ecommerce assignment that recreates the supplied Cartly design handoff. Customers can browse products, maintain a cart, apply single-use coupons, and complete simulated checkout. Admins can inspect live store metrics and generate a 10% coupon after every third successful order.

## Tech Stack
Turborepo, pnpm workspaces, Next.js App Router, React, Node.js, Express, TypeScript, Zod, Vitest, Supertest, and an in-memory store.

## Project Structure
- `apps/web`: handoff-matched Next.js storefront and admin UI
- `apps/api`: Express API, service layer, memory store, and tests
- `packages/shared`: shared products, constants, schemas, and types

## Setup
```bash
pnpm install
cp .env.example .env
```

## Run Development
```bash
pnpm dev
```
Frontend: http://localhost:3000  
Backend: http://localhost:4000

The example environment file contains the default local frontend and backend URLs.

## Deployment
- Render uses `render.yaml` to deploy the Express API and verify `/api/health`.
- Vercel uses `vercel.json` to build the Next.js application from the monorepo root.
- Set `NEXT_PUBLIC_API_URL` on Vercel to the deployed Render API URL.
- Set `FRONTEND_ORIGIN` on Render to the deployed Vercel production URL.

## Test, Build, and Lint
```bash
pnpm test
pnpm build
pnpm lint
```

## API Documentation
All errors use `{ "error": { "code": "ERROR_CODE", "message": "Human readable message." } }`.

| Method | Path | Request body | Success |
|---|---|---|---|
| GET | `/api/health` | none | service health |
| GET | `/api/products` | none | six products |
| GET | `/api/cart` | none | cart items and calculated summary |
| POST | `/api/cart/items` | `{ "productId": "1", "quantity": 1 }` | created/updated cart |
| PATCH | `/api/cart/items/:productId` | `{ "quantity": 3 }` | updated cart |
| DELETE | `/api/cart/items/:productId` | none | updated cart |
| POST | `/api/checkout` | `{ "couponCode": "CARTLY-A1B2C3" }` or `{}` | created order |
| POST | `/api/admin/discount-codes` | none | generated coupon |
| GET | `/api/admin/stats` | none | calculated orders, items, revenue, coupons, discounts |
| POST | `/api/dev/reset` | none | reset confirmation outside production |

Validation and business-rule failures return HTTP 400, missing resources return 404, created orders/coupons return 201, and unexpected errors return 500.

## Discount System
Every third successful order unlocks one manual admin coupon generation. A milestone can generate only one coupon. Coupons discount the subtotal by 10%, do not discount shipping, and become permanently used only after successful checkout.

## Admin APIs
`POST /api/admin/discount-codes` enforces milestone eligibility. `GET /api/admin/stats` calculates all metrics from actual in-memory orders and coupons.

## Known Limitations
- Store state resets when the API restarts.
- The app has one global cart because no user/session system was required.
- Authentication and payment processing are intentionally out of scope.
- The reset endpoint is available only outside production.
