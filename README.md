# BITEHUB

BITEHUB now uses a React + Vite frontend and a Spring Boot 4 + MySQL backend.

## Project Structure

- `frontend/` - React client
- `spring-backend/` - Spring Boot API
- `shared/` - shared booking rules used by the frontend and backend

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from `frontend/.env` or `frontend/.env.example`.

Default API URL:

```text
http://localhost:8080/api
```

## Backend Setup

```bash
cd spring-backend
mvn test
mvn spring-boot:run
```

The Spring backend expects MySQL connection values in `spring-backend/src/main/resources/application.yml` or environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

## Test Runner

From the repo root:

```bash
./run-all-tests.ps1
```

This runs the Spring backend tests and then the frontend tests.
