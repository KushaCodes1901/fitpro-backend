# FitPro Backend

FitPro is a SaaS fitness coaching platform that connects trainers and clients.

This repository contains the **backend API** responsible for authentication, business logic, and database operations.

The backend is built using **Node.js, Express, Prisma, and PostgreSQL**.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcrypt
* Zod validation
* Multer (file uploads)
* Nodemailer (email services)

---

## Features

### Authentication

* Register (Trainer / Client)
* Login
* JWT access tokens
* Refresh tokens
* Password reset
* Logout

### Role-Based Access Control

Three roles are supported:

* ADMIN
* TRAINER
* CLIENT

Middleware protects routes based on user roles.

---

### Trainer Features

* Manage clients
* Create workout plans
* Assign workouts
* Create nutrition plans
* Schedule training sessions
* Messaging with clients

---

### Client Features

* View assigned workout plans
* Log workouts
* Track progress
* View nutrition plans
* Messaging with trainer

---

### Admin Features

* Manage trainers
* Manage clients
* Platform analytics
* Announcements
* System settings

---

## Database

The backend uses **PostgreSQL** with **Prisma ORM**.

Main database entities include:

* Users
* Trainer Profiles
* Client Profiles
* Workout Plans
* Exercises
* Workout Logs
* Body Measurements
* Nutrition Plans
* Meals
* Sessions
* Messages
* Notifications

---

## Environment Variables

Create a `.env` file in the root of the project.

Example:

DATABASE_URL=postgresql://username:password@localhost:5432/fitpro_db

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

PORT=5000

FRONTEND_URL=http://localhost:3000

---

## Installation

Clone the repository

git clone https://github.com/YOUR_USERNAME/fitpro-backend.git

Install dependencies

npm install

---

## Prisma Setup

Initialize Prisma

npx prisma init

Run database migrations

npx prisma migrate dev

Seed the admin user

npx prisma db seed

---

## Running the Server

Start development server

npm run dev

Or start production server

npm start

The API will run at

http://localhost:5000

---

## API Base URL

/api/v1

Example endpoints:

POST /api/v1/auth/login
POST /api/v1/auth/register
GET /api/v1/users/me

---

## License

This project is created for educational and portfolio purposes.


#### Shkamb Kurshumlija