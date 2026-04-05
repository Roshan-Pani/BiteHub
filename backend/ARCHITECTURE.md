# Backend Architecture

## Layer Map

- `routes/` composes HTTP endpoints and wires controllers.
- `controllers/` handle request and response objects only.
- `services/` contain orchestration, business rules, and policy decisions.
- `repositories/` own Mongoose queries and writes.
- `models/` define schema and collection behavior.
- `utils/` hold pure helpers that do not know about HTTP or persistence.
- `auth/` holds mock-compatible identity helpers and future auth entry points.
- `middlewares/` hold reusable request-context and guard logic.

## Current Design

The API keeps the same public paths, but the implementation is now split into smaller modules. Shared pure rules live in `shared/bookingRules.js` so frontend and backend use the same date/time and booking policy logic.

The database bootstrap now creates collections and syncs Mongoose indexes before seeding the predefined dataset. In MongoDB this is the closest equivalent to a Hibernate-style schema update: collections are created on first write, and indexes are synchronized from model definitions with `syncIndexes()`.

## Current Scope

This phase keeps auth mock-compatible. The `/users/resolve` flow remains the identity bridge used by the frontend, and the request-user middleware only attaches optional context from headers.

## Test Strategy

- `src/tests/api.smoke.test.js` validates route boundary contracts that do not require persistence setup.
- `src/tests/api.integration.test.js` runs API integration tests against an in-memory MongoDB instance.
- `src/tests/service.rules.test.js` validates service-level booking and feedback policy behavior.
- Run backend tests with `npm test` from `backend/`.
- Run full-stack tests with `./run-all-tests.ps1` from the repo root.

## Refactor Rules

- Controllers should not call models directly.
- Services should not know about Express response objects.
- Repositories should not import controllers or routes.
- Shared pure rules should be reused rather than duplicated.
- Keep API contracts stable unless a route split is purely internal.
