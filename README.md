# Express Auth Service

A lightweight authentication API built with Express, TypeScript, and MongoDB.

It provides account registration, login, token refresh, logout, and a protected `me` endpoint using short-lived JWT access tokens plus persisted refresh-token sessions.

## Stack

- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT for access tokens
- Hashed refresh tokens stored in MongoDB
- Zod request validation
- Pino logging
- Helmet, CORS, compression, and rate limiting

## Features

- Email/password registration
- Login with access token and refresh token issuance
- Refresh-token rotation
- Logout by invalidating the active refresh token
- Protected route authentication with Bearer tokens
- Request validation and centralized error handling
- Environment-based config loading via `.env.<NODE_ENV>`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

The app loads environment variables from `.env.<NODE_ENV>`.

For local development, create:

```bash
.env.development
```

You can copy values from [.env.example](/Users/markandrey/repo/personal/nodejs/express-auth-service/.env.example):

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/express-auth-service
JWT_SECRET=replace-this-with-a-strong-secret
```

### 3. Start the development server

```bash
npm run dev
```

The API will connect to MongoDB and start on the configured `PORT`.

## Available Scripts

- `npm run dev` starts the app in watch mode with `NODE_ENV=development`
- `npm run build` compiles TypeScript into `dist/`
- `npm start` runs the compiled production build

## Environment Variables

Required variables:

- `PORT` API port
- `MONGO_URI` MongoDB connection string
- `JWT_SECRET` secret used to sign access tokens

## API Overview

Base URL:

```text
http://localhost:3000
```

### Endpoint Summary

| Method | Path | Auth | Request | Success response | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/health` | None | No body | `{ "status": "ok" }` | Basic service health check |
| `POST` | `/auth/register` | None | `{ "email": "user@example.com", "password": "secret123" }` | `{ "success": true, "data": { "user": { "id": "account-id", "email": "user@example.com", "emailVerified": false, "emailVerifiedAt": null, "createdAt": "2026-04-05T00:00:00.000Z", "updatedAt": "2026-04-05T00:00:00.000Z" }, "message": "Account created. Please verify your email address." } }` | Creates the account and sends a verification email |
| `GET` | `/auth/verify-email?token=...` | None | Query param: `token` | `{ "success": true, "data": { "message": "Email verified successfully." } }` | Fails if the token is missing, invalid, or expired |
| `POST` | `/auth/resend-verification` | None | `{ "email": "user@example.com" }` | `{ "success": true, "data": { "message": "Verification email sent." } }` | For unverified accounts only; 60-second cooldown and 5-request cap per 24 hours |
| `POST` | `/auth/login` | None | `{ "email": "user@example.com", "password": "secret123" }` | `{ "success": true, "data": { "user": { "id": "account-id", "email": "user@example.com", "emailVerified": true, "emailVerifiedAt": "2026-04-05T00:10:00.000Z", "createdAt": "2026-04-05T00:00:00.000Z", "updatedAt": "2026-04-05T00:10:00.000Z" }, "accessToken": "jwt-access-token", "refreshToken": "plain-text-refresh-token" } }` | Login is blocked until email is verified |
| `POST` | `/auth/refresh` | None | `{ "refreshToken": "plain-text-refresh-token" }` | `{ "success": true, "data": { "user": { ... }, "accessToken": "new-jwt-access-token", "refreshToken": "new-plain-text-refresh-token" } }` | Rotates the session by revoking the old refresh token and issuing a new pair |
| `POST` | `/auth/logout` | None | `{ "refreshToken": "plain-text-refresh-token" }` | `{ "success": true, "data": { "message": "Logged out successfully" } }` | Invalidates the active refresh-token session |
| `GET` | `/auth/me` | `Authorization: Bearer <accessToken>` | No body | `{ "success": true, "data": { "id": "account-id", "email": "user@example.com", "emailVerified": true, "emailVerifiedAt": "2026-04-05T00:10:00.000Z", "createdAt": "2026-04-05T00:00:00.000Z", "updatedAt": "2026-04-05T00:10:00.000Z" } }` | Returns the currently authenticated user |

All auth endpoints except `GET /health` use the standard success envelope:

```json
{
  "success": true,
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "message": "..."
}
```

## Validation Rules

- `email` must be a valid email address
- `password` must be at least 6 characters
- `refreshToken` must be a non-empty string

## Project Structure

```text
src/
  app/
    middlewares/
  config/
  infrastructure/
  modules/
    auth/
  shared/
```

## Request Flow

1. Register a user with `/auth/register`
2. Log in with `/auth/login`
3. Send the returned access token as `Bearer <token>` to protected routes
4. When the access token expires, call `/auth/refresh`
5. On sign-out, call `/auth/logout`

## Notes

- CORS is enabled globally
- Helmet and compression are enabled
- Rate limiting is applied to `/auth/*` and `/health`
- Logs are handled through Pino and `pino-http`
