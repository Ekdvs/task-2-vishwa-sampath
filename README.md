# User Management API

A production-ready RESTful API for managing users, built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. Designed to demonstrate clean architecture, robust validation, and proper error handling for portfolio and recruiter review.

## Features

- Full CRUD operations for User resources
- Pagination, search, and sorting on the list endpoint
- Request validation using `express-validator`
- Centralized, consistent JSON response format (success & error)
- Global error-handling middleware (validation errors, duplicate keys, invalid IDs, 404s, 500s)
- Clean, scalable folder structure with separation of concerns
- Environment-based configuration via `.env`
- Request logging with Morgan
- CORS enabled

## Tech Stack

| Layer        | Technology        |
|--------------|--------------------|
| Runtime      | Node.js            |
| Framework    | Express.js         |
| Database     | MongoDB            |
| ODM          | Mongoose           |
| Validation   | express-validator  |
| Logging      | Morgan             |
| Config       | dotenv             |
| Dev Tooling  | Nodemon            |

## Folder Structure

```
project-root/
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection logic
│   ├── controllers/
│   │   └── userController.js    # Business logic for User routes
│   ├── routes/
│   │   ├── index.js             # API route aggregator + health check
│   │   └── userRoutes.js        # User-specific routes
│   ├── middlewares/
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── notFound.js          # 404 handler
│   │   └── validateRequest.js   # express-validator result handler
│   ├── validators/
│   │   └── userValidator.js     # Validation rule chains
│   ├── models/
│   │   └── User.js              # Mongoose User schema
│   ├── utils/
│   │   ├── apiResponse.js       # successResponse / errorResponse helpers
│   │   ├── ApiError.js          # Custom operational error class
│   │   └── asyncHandler.js      # Async route wrapper
│   └── app.js                   # Express app configuration
├── server.js                    # Application entry point
├── .env                          # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Installation

```bash
git clone <your-repo-url>
cd user-management-api
npm install
```

## Environment Setup

Create a `.env` file in the project root (an example is already included):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management_db
NODE_ENV=development
```

> For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## Run Commands

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:5000` by default.

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint              | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/health`              | Health check                         |
| POST   | `/users`               | Create a new user                    |
| GET    | `/users`               | Get all users (pagination/search/sort)|
| GET    | `/users/:id`           | Get a single user by ID              |
| PUT    | `/users/:id`           | Update a user by ID                  |
| DELETE | `/users/:id`           | Delete a user by ID                  |

### Query Parameters for `GET /users`

| Param    | Type   | Default     | Description                              |
|----------|--------|-------------|-------------------------------------------|
| page     | number | 1           | Page number                              |
| limit    | number | 10          | Results per page (max 100)               |
| search   | string | -           | Searches `name` and `email` (case-insensitive) |
| sortBy   | string | createdAt   | One of: name, email, age, createdAt, updatedAt |
| order    | string | desc        | `asc` or `desc`                          |
| role     | string | -           | Filter by role: `user` or `admin`        |

## Request Examples

**Create User**

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 28,
  "role": "user"
}
```

**Get Users (with query params)**

```http
GET /api/v1/users?page=1&limit=5&search=john&sortBy=name&order=asc
```

**Update User**

```http
PUT /api/v1/users/64f1a2b3c4d5e6f7a8b9c0d1
Content-Type: application/json

{
  "age": 30
}
```

## Response Examples

**Success**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 28,
    "role": "user",
    "createdAt": "2026-06-19T10:00:00.000Z",
    "updatedAt": "2026-06-19T10:00:00.000Z"
  }
}
```

**Paginated List**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [ ... ],
    "pagination": {
      "totalUsers": 42,
      "totalPages": 5,
      "currentPage": 1,
      "pageSize": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Validation Error (422)**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" },
    { "field": "age", "message": "Age must be a number between 18 and 100" }
  ]
}
```

**Duplicate Key Error (409)**

```json
{
  "success": false,
  "message": "Duplicate value error",
  "errors": [
    { "field": "email", "message": "email \"john.doe@example.com\" already exists" }
  ]
}
```

**Not Found (404)**

```json
{
  "success": false,
  "message": "User not found with id: 64f1a2b3c4d5e6f7a8b9c0d1",
  "errors": []
}
```

## Error Handling

All errors flow through a single global error-handling middleware (`src/middlewares/errorHandler.js`), which normalizes:

- Mongoose `ValidationError` → `422 Unprocessable Entity`
- Mongoose `CastError` (invalid ObjectId) → `400 Bad Request`
- MongoDB duplicate key error (`code 11000`) → `409 Conflict`
- Custom `ApiError` (e.g., not found) → status code defined on the error
- Any unhandled error → `500 Internal Server Error`

The app also listens for `unhandledRejection` so a failed async operation never crashes the Node process.

## HTTP Status Codes Used

`200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500` — applied consistently per REST conventions.

## Testing the API

You can test endpoints using `curl`, Postman, or Insomnia. Example:

```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","age":25,"role":"admin"}'
```

Recommended checks before pushing to GitHub:
- [ ] MongoDB connects successfully on `npm run dev`
- [ ] All 5 CRUD endpoints return correct status codes
- [ ] Invalid payloads return `422` with field-level errors
- [ ] Duplicate email returns `409`
- [ ] Invalid `:id` returns `400`; non-existent `:id` returns `404`
- [ ] Unknown routes return `404` via the `notFound` middleware

## Future Improvements

- JWT-based authentication and role-based authorization (`401`/`403` enforcement)
- Rate limiting and request throttling
- Unit/integration tests with Jest + Supertest
- Swagger/OpenAPI documentation
- Dockerfile and docker-compose for local MongoDB
- CI/CD pipeline (GitHub Actions) for automated testing and deployment
- Soft delete and audit logging

## License

MIT

## 🎥 Demo Video

👉 [Download/View Demo](./demo.mp4)#