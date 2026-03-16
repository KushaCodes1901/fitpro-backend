# FitPro Backend

Backend API for FitPro SaaS (ADMIN / TRAINER / CLIENT roles).

## Current Scope

This repository now includes:

- Express API with `/api/v1` route groups
- Prisma schema covering core FitPro entities
- JWT access + refresh token authentication
- Role-based middleware for protected routes
- Auth endpoints (`register`, `login`, `logout`, `refresh`, `forgot-password`, `reset-password`, `me`)
- Seed script for initial admin account

## Stack

- Node.js + Express
- Prisma ORM + PostgreSQL
- JWT + bcrypt
- Zod

## Project Structure

```txt
src/
  config/
  controllers/
  middleware/
  routes/
  services/
  validators/
  utils/
prisma/
uploads/
```

## Environment

Copy `.env.example` to `.env` and configure values.

Key values:

- `DATABASE_URL=postgresql://postgres:password@localhost:5432/fitpro_db`
- `JWT_ACCESS_EXPIRY=15m`
- `JWT_REFRESH_EXPIRY=7d`
- `PORT=5000`

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## API Route Groups

- `/api/v1/auth`
- `/api/v1/admin`
- `/api/v1/trainer`
- `/api/v1/client`
- `/api/v1/messages`

## Notes

- `forgot-password` and `reset-password` endpoints are scaffolded and ready for email token workflow implementation.
- Feature-specific trainer/client/admin modules are scaffolded for incremental build-out.
