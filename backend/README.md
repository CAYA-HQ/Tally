# Tally BACKEND/ DB

## Overview
This backend service is built using **Bun**, **Express.js**, **MongoDB**, and **Mongoose**.

The application follows a modular and scalable architecture with proper separation of concerns for:
- routing
- controllers
- validation
- database configuration
- middleware
- utilities

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

---

# Project Structure

```txt
src/
│
├── config/
│   └── db.ts
│
├── controllers/
│   └── user.controller.ts
│
├── models/
│   ├── User.ts
│   └── validate.user.ts
│
├── routes/
│   ├── api.ts
│   └── userRouter.ts
│
├── utils/
│   ├── asyncHandler.ts
│   ├── errorHandler.ts
│   └── validate.middleware.ts
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
routes/userRouter.ts
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
```

---

## Endpoint Definitions

Defined in:

```ts
routes/userRouter.ts
```

Examples:

```txt
POST   /api/user
GET    /api/user/:id
PUT    /api/user/:id
```

---

# Controllers

Controllers are responsible for handling incoming HTTP requests and coordinating business logic.

Location:

```ts
controllers/user.controller.ts
```

Responsibilities include:
- processing request data
- interacting with database models
- handling responses
- returning appropriate HTTP status codes

---

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