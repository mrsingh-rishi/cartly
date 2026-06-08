# Cartly Engineering Decisions

## Decision: Turborepo with separate frontend and backend
**Context:** The assignment requires independently runnable web and API applications.  
**Options Considered:**
- Option A: One Next.js application
- Option B: Turborepo with separate applications
**Choice:** Turborepo with `apps/web` and `apps/api`.  
**Why:** It keeps deployment and concerns explicit while retaining shared tooling.

## Decision: Express backend instead of Next.js API routes
**Context:** The backend must demonstrate Node.js API design.  
**Options Considered:**
- Option A: Next.js route handlers
- Option B: Express
**Choice:** Express.  
**Why:** It cleanly satisfies the assignment and supports Supertest API tests.

## Decision: In-memory store instead of database
**Context:** Persistence was not required.  
**Options Considered:**
- Option A: Database
- Option B: Process-local memory
**Choice:** In-memory store.  
**Why:** It avoids unnecessary infrastructure and keeps business rules visible.

## Decision: Cents-based money handling
**Context:** Floating point math can corrupt totals.  
**Options Considered:**
- Option A: Decimal JavaScript numbers
- Option B: Integer cents
**Choice:** Integer cents internally.  
**Why:** Shipping, discounts, revenue, and totals remain deterministic.

## Decision: Shared package for contracts
**Context:** Both applications need the same products, types, constants, and schemas.  
**Options Considered:**
- Option A: Duplicate definitions
- Option B: Shared workspace package
**Choice:** `@cartly/shared`.  
**Why:** It prevents frontend/backend contract drift.

## Decision: Service layer for business logic
**Context:** Route handlers should remain thin and testable.  
**Options Considered:**
- Option A: Rules inside routes
- Option B: Domain service
**Choice:** Central ecommerce service.  
**Why:** It separates HTTP concerns from cart, checkout, and admin rules.

## Decision: Track generated milestones
**Context:** Repeated generation at order 3 must fail.  
**Options Considered:**
- Option A: Infer from coupon count
- Option B: Explicit milestone list
**Choice:** Store generated milestone numbers.  
**Why:** It directly models the invariant and prevents duplicates.

## Decision: Validate coupons on the backend
**Context:** Checkout totals cannot trust browser state.  
**Options Considered:**
- Option A: Frontend validation
- Option B: Backend validation during checkout
**Choice:** Backend validation.  
**Why:** It enforces validity and single use at the trust boundary.

## Decision: Focus tests on business rules
**Context:** The assignment requires confidence in cart, checkout, and coupons.  
**Options Considered:**
- Option A: Snapshot-heavy UI tests
- Option B: HTTP integration tests
**Choice:** Vitest and Supertest API tests.  
**Why:** They cover behavior through the public API without implementation coupling.

## Decision: No auth or payment
**Context:** Neither system is required by the assignment.  
**Options Considered:**
- Option A: Add simulated infrastructure
- Option B: Keep them out of scope
**Choice:** No auth or payment gateway.  
**Why:** It avoids over-engineering and keeps focus on required ecommerce rules.
