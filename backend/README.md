# Tally BACKEND/ DB

## Overview
This backend service is built using **Bun**, **Express.js**, **Passportjs**, **Redis**, **MongoDB**, and **Mongoose**.

The application follows a modular and scalable architecture with proper separation of concerns for:
- routing
- controllers
- validation
- database configuration
- middleware
- utilities
- Authentication

The project is containerized using Docker to ensure a consistent development environment across all systems.

---

# Tech Stack

| Technology |          Purpose                     |
|------------|--------------------------------------|
| Bun        | JavaScript runtime & package manager |
| Express.js | Backend framework                    |
| MongoDB    | Database                             |
| Mongoose   | MongoDB ODM                          |
| Zod        | Request validation                   |
| Docker     | Containerization                     |
| dotenv     | Environment variable management      |
| redis      | storing state session                |
| cookies    | storing stateless session            |
| passportjs | different authentication strategy    |

---

# Project Structure

```txt
src/
│
├── config/
│   └── db.ts
│   └── redis.ts
│
├── controllers/
│   └── user.controller.ts
│   └── auth controller.ts
│
├── models/
│   ├── User.ts
│   └── validate.user.ts
│
├── routes/
│   ├── api.ts
│   ├── auth.ts
│   └── userRouter.ts
│
├── service
│   └── user.service.ts
│
├── utils/
│   ├── asyncHandler.ts
│   ├── errorHandler.ts
│   ├── validate.middleware.ts
│   ├── passportStrategy/
│         └── googlestrategy.ts
│
├── index.ts
│
└── .env
```

---

# Architecture Flow

The request lifecycle follows this structure:

```txt
Client Request
      ↓
index.ts
(Base route: /api)
      ↓
routes/api.ts
(Route grouping: /user)
      ↓
routes/userRouter.ts & routes/auth.ts
(Endpoint definitions)
      ↓
Middleware Layer
(Validation / Error handling)
      ↓
Controller Layer
(Business logic)
      ↓
Database Layer
(Mongoose Models)
      ↓
Response
```

---

# Routing Structure

## Base API Route

Defined in:

```ts
index.ts
```

Example:

```ts
app.use("/api", apiRoutes);
```

---

## Feature Route Layer

Defined in:

```ts
routes/api.ts
```

Example:

```ts
router.use("/user", userRouter);
            &
router.use("/auth", authRouter)
```

---

## Endpoint Definitions

Defined in:

```ts
routes/userRouter.ts
      &
routes/auth.ts
```

Examples:

```txt
user: POST/api/user
      GET/api/user/:id
      PUT/api/user/:id

auth: POST/api/auth/login
      GET/api/auth/signup
      PUT/api/auth/logout
```

---

# Controllers

Controllers are responsible for handling incoming HTTP requests and coordinating business logic.

Location:

```ts
controllers/user.controller.ts
            &
controllers/auth.controllers.ts
```

Responsibilities include:
- processing request data
- interacting with database models
- handling responses
- returning appropriate HTTP status codes


---

# Authentication Strategy

## 1. schema

Location:

```ts
models/User.ts 
```
used to defined user schema in db when registering

---

## 2. JASON web token (JWT)

location:

```ts
utils/jwt.ts
```
used to create session token for users login verification it also uses cookies

---

## 3. bcrypt

Location:

```ts 
utils/bcrypt.this
```
used for password encryption

---

## .4 Authentication strategy

location:
```ts
utils/passportStrategy/googlestrategy.ts
```
used to create passportjs google registration strategy
---

## 5. Verifying user API

Location:
```ts 
middleware/verifyUserRoute.ts 
```
used as a protection mechanism, to verif user route


# Validation Strategy

The application uses layered validation to ensure data integrity and request safety.

## 1. Request Validation (Zod)

Location:

```ts
models/validate.user.ts
```

Used to validate incoming request payloads before business logic execution.

---

## 2. Database Validation (Mongoose)

Location:

```ts
models/User.ts
```

Mongoose schema validation ensures database-level data consistency.

---

# Utility Functions:

## asyncHandler

Location:

```ts
utils/asyncHandler.ts
```

Used to wrap asynchronous route handlers and prevent repetitive try/catch blocks.

---

## errorHandler

Location:

```ts
utils/errorHandler.ts
```

Centralized error handling utility for consistent API error responses.

---

# Environment Variables

Environment variables are managed using:

```env
.env
```

Example variables:

```env
PORT=3000
MONGO_URI=your_database_uri
JWT_SECRET=your_secret
```

---

# Database Configuration

Database connection logic is located in:

```ts
config/db.ts
```

Responsibilities:
- establishing MongoDB connection
- handling connection errors
- exporting reusable database configuration

---

# Docker Setup

Docker is used to:
- standardize the development environment
- ensure dependency consistency
- simplify onboarding
- containerize the backend service

---

# Getting Started

## Prerequisites

Install:
- Docker Desktop
- Git
- Bun

---

# Installation

Clone the repository:

```bash
git clone <repository_url>
```

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
bun install
```

---

# Running with Docker

Build and start the container:

```bash
docker compose up --build
```

---

# Running Locally

Start the development server:

```bash
bun run dev
```

---

# Development Goals

This backend architecture is designed with:
- modularity
- scalability
- maintainability
- separation of concerns
- reusable middleware patterns

in mind, making it suitable for collaborative development and future expansion.