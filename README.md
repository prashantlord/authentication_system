# Authentication System

A robust, production-ready authentication API built with Node.js, Express, MongoDB, and Redis. This system provides secure user registration, login, email verification, password reset, and JWT-based authentication with rate limiting and background email processing.

## Features

- **User Registration & Login** - Secure authentication with bcrypt password hashing
- **JWT Authentication** - Token-based session management
- **Email Verification** - Verify user email addresses via confirmation links
- **Password Reset** - Secure password reset flow with time-limited tokens
- **Rate Limiting** - Protection against brute-force attacks using Redis
- **Background Email Processing** - Queue-based email delivery using BullMQ
- **Input Validation** - Zod schema validation
- **Role-based Access** - User, admin, and developer roles
- **Docker Support** - MongoDB and Redis containers

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache/Queue**: Redis (ioredis + BullMQ)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: Nodemailer + EJS templates
- **Container**: Docker Compose

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB (local or container)
- Redis (local or container)

## Installation

```bash
# Install dependencies
npm install

# Start infrastructure (MongoDB + Redis)
docker-compose up -d

# Copy environment file and configure
cp .env.example .env
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=password
MONGO_PORT=27017
MONGO_DB=auth_system

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Mailer (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=Your App <noreply@yourapp.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

## Running the Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start

# Run email worker separately
npm run worker:email
```

The API runs at `http://localhost:3000`.

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| PATCH | `/api/auth/forgot-password/:userId/:token` | Reset password with token |

### Protected Endpoints (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth` | Get current user |
| POST | `/api/auth/verify-email` | Send email verification |
| GET | `/api/auth/verify-email/:userId/:token` | Verify email |
| POST | `/api/auth/reset-password` | Request authenticated password reset |
| PATCH | `/api/auth/reset-password/:userId/:token` | Reset password (authenticated) |

## Request & Response Formats

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "emailVerifiedAt": null
    },
    "token": "eyJhbGciOiJIUzI1..."
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Authentication failed"
}
```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── db.js         # MongoDB connection
│   ├── mailer.js     # Nodemailer transporter
│   ├── limiter.js    # Rate limiter config
│   └── redis.js      # Redis client
├── controllers/     # Request handlers
│   ├── user.controller.js
│   ├── email-verification.controller.js
│   ├── forgot-password.controller.js
│   └── reset-password.controller.js
├── middleware/       # Express middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── rateLimiter.js
│   └── validate.js
├── models/           # Mongoose models
│   └── user.model.js
├── routes/          # API routes
│   └── auth.routes.js
├── schema/           # Zod validation schemas
│   ├── login.schema.js
│   ├── register.schema.js
│   ├── verify-email.schema.js
│   ├── forgot-password.schema.js
│   └── reset-password.schema.js
├── services/         # Business logic
│   ├── login.service.js
│   ├── register.service.js
│   ├── email-verification.service.js
│   ├── forgot-password.service.js
│   └── reset-password.service.js
├── jobs/             # Background jobs
│   ├── queues/
│   │   └── email.queue.js
│   └── workers/
│       └── email.worker.js
├── email/            # Email templates
│   └── templates/
│       ├── verify-email.ejs
│       ├── forget-password.ejs
│       └── reset-password.ejs
├── utils/            # Utilities
│   ├── token.js
│   ├── response-helper.js
│   └── send-email.js
├── app.js            # Express app
└── index.js         # Entry point
```

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Signed with HS256, configurable expiration
- **Rate Limiting**: Per-IP limits using Redis
  - Auth endpoints: 5 requests/minute
  - Protected endpoints: 100 requests/minute
- **Input Validation**: All inputs validated with Zod
- **SQL Injection Protection**: Mongoose parameterization
- **XSS Protection**: Express JSON body parsing

## Background Processing

Emails are processed via BullMQ queues for reliability:

- Verifications are queued and processed asynchronously
- Failed emails are retried automatically
- Worker can be scaled independently

```bash
# Run worker only
npm run worker:email
```

## Testing

Use tools like Postman or curl:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# Get current user (with token)
curl -X GET http://localhost:3000/api/auth \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## License

ISC