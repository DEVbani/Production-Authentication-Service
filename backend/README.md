# Production Auth Backend

A production-ready authentication backend built with Express, Prisma, PostgreSQL, Redis, JWT, and email verification via Resend.

## Key Features

- User registration with email verification
- Login with access token and refresh-token cookie support
- Protected profile endpoint with role-based authorization
- Admin-only routes for user management actions
- JWT access and refresh tokens
- Redis-backed refresh token session store
- Prisma ORM with PostgreSQL database support

## Tech Stack

- Node.js + Express
- PostgreSQL via Prisma
- Redis for refresh token session storage
- JWT for authentication
- Resend email service for verification emails
- bcrypt for password hashing
- express-validator for input validation

## Requirements

- Node.js 18+ / compatible runtime
- PostgreSQL database
- Redis server
- Resend API key for email delivery

## Environment Variables

Create a `.env` file in the project root and define the following values:

```env
PORT=5001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
API_KEY=your_resend_api_key
NODE_ENV=development
```

> Note: `EMAIL` and `APP_PASS` are not currently used by the active email implementation.

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run start
```

The server listens on the port defined by `PORT`.

## Prisma

The project uses Prisma for database access. If you need to apply database changes:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## API Endpoints

### Public

- `GET /health`
  - Returns service status and uptime.
- `POST /auth/register`
  - Register a new user.
  - Request body: `{ "email": "...", "password": "...", "name": "..." }`
- `POST /auth/login`
  - Authenticate user and set refresh token cookie.
  - Request body: `{ "email": "...", "password": "..." }`
- `GET /auth/verify/:token`
  - Verify user email with the token sent by email.
- `POST /auth/refresh`
  - Refresh access token using the refresh token cookie.
- `POST /auth/logout`
  - Clear refresh token cookie and log out.

### Protected

- `GET /auth/profile`
  - Requires `Authorization: Bearer <accessToken>` header.
  - Returns authenticated user profile data.

### Admin

- `GET /admin/users`
  - Requires authenticated admin user.
- `GET /admin/user/:id`
  - Requires authenticated admin user.

## Authentication Flow

1. User registers via `/auth/register`.
2. Verification email is sent with a link to:
   `http://localhost:5001/auth/verify/<token>`
3. After verifying, the user can log in.
4. Login returns an access token and stores a refresh token in a cookie.
5. Use `Authorization: Bearer <accessToken>` for protected routes.
6. Refresh access tokens via `/auth/refresh`.

## Notes

- Access and refresh tokens are signed using separate secrets.
- Refresh tokens are stored in Redis under `refresh:<userId>`.
- Email verification is required before login.
- Permissions are defined in `permission.js` and mapped by role in `rolePermission.js`.

## Project Structure

- `app.js` - Express app configuration
- `server.js` - Server bootstrap
- `routes/` - API route definitions
- `controllers/` - Request handlers
- `middlewares/` - Auth and error middleware
- `services/` - Business logic and token/session handling
- `repositories/` - Data access and Redis helpers
- `config/` - Configuration for Prisma, Redis, auth, and email
- `utils/` - JWT and hashing helpers
- `prisma/schema.prisma` - Database schema
