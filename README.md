# FitPro Backend

Backend API for the FitPro SaaS platform.

This service handles:

- authentication
- role-based access control
- trainer/client/admin features
- workout plans
- nutrition plans
- sessions
- messaging
- notifications
- announcements
- admin settings
- profile management

---

## 1. Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs
- dotenv

---

## 2. Requirements

Before running this backend, make sure these are installed on your machine:

### Required
- Node.js 20+ recommended
- npm
- PostgreSQL 14+ recommended
- Git

### Optional but useful
- Postman
- Prisma Studio
- VS Code / Cursor

---

## 3. Clone the Repository

```bash
git clone <YOUR_BACKEND_REPO_URL>
cd fitpro-backend

## 4. Install Depnedencies

```bash
npm install


## 5. PostgreSQL Setup

## If PostgreSQL is not installed, install it first from their site.

## Create the database

## Open PostgreSQL and create a database called:

CREATE DATABASE fitpro_db;

You can do this from:

pgAdmin
psql terminal
DBeaver
any PostgreSQL client
6. Create the Environment File

Create a file named:

.env

in the root of the backend project.

Use this template:

PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/fitpro_db

JWT_SECRET=your_super_secret_key_here

FRONTEND_URL=http://localhost:8080

ADMIN_EMAIL=admin@fitpro.com
ADMIN_PASSWORD=Admin123!
ADMIN_FIRST_NAME=FitPro
ADMIN_LAST_NAME=Admin

TRAINER_EMAIL=sarah_j.trainer@fitpro.com
TRAINER_PASSWORD=SarahJTrainer123!
TRAINER_FIRST_NAME=Sarah
TRAINER_LAST_NAME=Johnson

CLIENT_EMAIL=mike_c.client@fitpro.com
CLIENT_PASSWORD=MikeCClient123!
CLIENT_FIRST_NAME=Mike
CLIENT_LAST_NAME=Chen
Important

Replace this value:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/fitpro_db

with your real PostgreSQL username/password if different.

Example:

DATABASE_URL=postgresql://postgres:myrealpassword@localhost:5432/fitpro_db
7. Prisma Setup
Run database migrations
npx prisma migrate dev

This will:

create the tables
apply schema changes
prepare the database structure
Generate Prisma client
npx prisma generate
8. Seed / Create Initial Users

If your project includes a seed script, run:

npx prisma db seed

If the seed command is not configured in the project, use whichever startup/seed flow your repository already contains.

If users are still missing

Use the frontend register page or Postman to create users manually.

Suggested test users:

Admin
Email: admin@fitpro.com
Password: Admin123!
Trainer
Email: sarah_j.trainer@fitpro.com
Password: SarahJTrainer123!
Client
Email: mike_c.client@fitpro.com
Password: MikeCClient123!

If the admin user is not auto-created, create it manually through the database or an existing seed script.

9. Start the Backend
Development mode
npm run dev
Production mode
npm start

The backend should run on:

http://localhost:5000

Base API URL:

http://localhost:5000/api/v1
10. Verify the Server

Open in browser:

http://localhost:5000

You should see the backend running message.

You can also test an endpoint with Postman:

POST http://localhost:5000/api/v1/auth/login

Body:

{
  "email": "sarah_j.trainer@fitpro.com",
  "password": "SarahJTrainer123!"
}
11. Important API Areas
Auth
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
Users
GET /api/v1/users/me
PUT /api/v1/users/me
PUT /api/v1/users/me/email
PUT /api/v1/users/me/password
PUT /api/v1/users/me/avatar
PUT /api/v1/users/me/client-profile
Trainer
GET /api/v1/trainer/profile
PUT /api/v1/trainer/profile
GET /api/v1/trainer/clients
POST /api/v1/trainer/clients/assign
GET /api/v1/trainer/clients/:clientId/progress
Workout Plans
GET /api/v1/trainer/plans
POST /api/v1/trainer/plans
POST /api/v1/trainer/plans/:id/assign
Nutrition
GET /api/v1/nutrition/trainer
POST /api/v1/nutrition/trainer
PUT /api/v1/nutrition/trainer/:id
POST /api/v1/nutrition/trainer/:id/assign
GET /api/v1/nutrition/client
Sessions
GET /api/v1/sessions/trainer
POST /api/v1/sessions/trainer
GET /api/v1/sessions/client
Messages
GET /api/v1/messages
POST /api/v1/messages
GET /api/v1/messages/:userId
Client
GET /api/v1/client/plans
POST /api/v1/client/workouts/log
GET /api/v1/client/workouts/history
POST /api/v1/client/progress
GET /api/v1/client/progress
GET /api/v1/client/trainer
Admin
GET /api/v1/admin/trainers
GET /api/v1/admin/clients
PUT /api/v1/admin/users/:id/status
GET /api/v1/admin/analytics
GET /api/v1/admin/settings
PUT /api/v1/admin/settings
Announcements
GET /api/v1/announcements
POST /api/v1/announcements
Notifications
GET /api/v1/notifications
PUT /api/v1/notifications/:id/read
PUT /api/v1/notifications/read-all
12. Authentication

Protected endpoints require a Bearer token.

Example header:

Authorization: Bearer YOUR_JWT_TOKEN

You can get the token from login response.

13. Useful Commands
Install dependencies
npm install
Run backend
npm run dev
Run migrations
npx prisma migrate dev
Generate Prisma client
npx prisma generate
Open Prisma Studio
npx prisma studio
Seed database
npx prisma db seed
14. Recommended First-Time Setup Checklist

Follow these steps in order:

Step 1

Install Node.js and PostgreSQL

Step 2

Clone the repo

Step 3

Run:

npm install
Step 4

Create PostgreSQL database:

CREATE DATABASE fitpro_db;
Step 5

Create .env

Step 6

Run:

npx prisma migrate dev
npx prisma generate
Step 7

Seed users if supported:

npx prisma db seed
Step 8

Start backend:

npm run dev
Step 9

Test login in Postman

15. Troubleshooting
Prisma file lock on Windows

If Prisma throws a file lock error:

stop backend server
close open terminals
rerun:
npx prisma generate

If needed, restart the PC.

OneDrive issue

If the project is inside OneDrive, Prisma may lock files more often. Moving the project outside OneDrive can help.

CORS issues

Make sure backend .env has:

FRONTEND_URL=http://localhost:8080
Database connection issue

Check DATABASE_URL carefully and confirm PostgreSQL is running.

Missing users

Seed the DB or create users manually through register.