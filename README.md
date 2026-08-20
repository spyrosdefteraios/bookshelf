# 📚 BookShelf

A full-stack library management application where users can browse books, leave reviews, and admins can manage the catalog.

## 🛠️ Tech Stack

**Frontend**
- [Angular](https://angular.dev/)
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Domain-Driven Design (DDD) architecture
- Swagger for API documentation

**Infrastructure**
- Docker & Docker Compose

## 📁 Project Structure

```
bookshelf/
├── backend/
│   ├── src/
│   │   ├── application/
│   │   │   └── controllers/       # authController, bookController, reviewController, adminController
│   │   ├── domain/
│   │   │   ├── entities/          # Book, Review, User
│   │   │   ├── errors/            # AppError
│   │   │   ├── repositories/      # Interfaces
│   │   │   └── services/          # AuthService, BookService, ReviewService
│   │   ├── infrastructure/
│   │   │   ├── database/          # Mongoose models & connection
│   │   │   ├── middleware/        # auth, errorHandler
│   │   │   └── repositories/      # InMemory & Mongo implementations
│   │   ├── config/                 # logger, swagger
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   ├── guards/         # auth.guard, admin.guard
│   │       │   ├── interceptors/   # auth.interceptor
│   │       │   ├── models/
│   │       │   └── services/       # auth.service, book.service
│   │       ├── features/
│   │       │   ├── admin/
│   │       │   ├── auth/           # login, register
│   │       │   ├── books/          # books list, book-detail
│   │       │   ├── dashboard/
│   │       │   └── profile/
│   │       └── shared/
│   │           └── navbar/
│   └── package.json
│
└── docker-compose.yml
```

## 🏗️ Architecture

The backend follows **Domain-Driven Design (DDD)** with a clear separation of concerns:

- **Domain layer** – business logic, entities, and interfaces, independent of any storage technology
- **Application layer** – controllers that expose the API endpoints
- **Infrastructure layer** – repository implementations (MongoDB or in-memory), middleware, database connection

This makes it easy to swap the storage technology (e.g. from in-memory to MongoDB) without touching the business logic. The repository implementation used at runtime is selected via the `USE_MONGO` environment variable (see below).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Docker & Docker Compose (recommended, for running with MongoDB)
- Angular CLI (`npm install -g @angular/cli`), if running the frontend manually

### Option 1 — Run with Docker (recommended)

This spins up the backend, frontend, and a MongoDB instance together.

```bash
docker-compose up --build
```

Once running:
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- Swagger API docs: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/health`

### Option 2 — Run Manually

**1. Backend**

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (see [Environment Variables](#️-environment-variables) below), then start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`, with Swagger docs at `http://localhost:3000/api/docs`.

**2. Frontend**

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

> By default the backend runs with `USE_MONGO=false`, meaning it uses **in-memory repositories** — no database setup required to get started, but data is reset every time the server restarts. To persist data with MongoDB, set `USE_MONGO=true` and make sure MongoDB is running (either locally or via Docker) and reachable at the URI in `MONGO_URI`.

## ⚙️ Environment Variables

Create a `.env` file inside `backend/` with the following variables:

```dotenv
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookshelf
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
USE_MONGO=false
```

| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment (`development` / `production`) |
| `PORT` | Port the backend server listens on |
| `MONGO_URI` | MongoDB connection string (only used when `USE_MONGO=true`) |
| `JWT_SECRET` | Secret key used to sign JWT tokens — keep this private |
| `JWT_EXPIRES_IN` | JWT token expiration time |
| `CORS_ORIGIN` | Allowed origin(s) for CORS |
| `USE_MONGO` | `true` to use MongoDB, `false` to use in-memory storage |

> ⚠️ Never commit your `.env` file. It is already excluded via `.gitignore`.

## ✨ Features

- 🔐 User registration / login with JWT authentication, and route protection via guards (frontend) and middleware (backend)
- 📖 Book search, browsing, and management (create, update, delete)
- ⭐ Book reviews (create, view, delete)
- 👤 User profile and personal book dashboard
- 🛡️ Admin dashboard — manage users and view stats
- 📑 Interactive API documentation via Swagger at `/api/docs`
- 🚦 Rate limiting on authentication endpoints

## 📖 API Overview

All endpoints (except `/health`) are prefixed with `/api`. Full interactive documentation is available via Swagger once the backend is running.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in | Public |
| GET | `/api/auth/me` | Get current user profile | Required |
| GET | `/api/books` | List books | Required |
| GET | `/api/books/stats` | Book statistics | Required |
| GET | `/api/books/:id` | Get a book by id | Required |
| POST | `/api/books` | Create a book | Required |
| PUT | `/api/books/:id` | Update a book | Required |
| DELETE | `/api/books/:id` | Delete a book | Required |
| GET | `/api/books/:bookId/reviews` | List reviews for a book | Required |
| POST | `/api/books/:bookId/reviews` | Add a review | Required |
| DELETE | `/api/reviews/:id` | Delete a review | Required |
| GET | `/api/admin/users` | List all users | Admin only |
| GET | `/api/admin/stats` | Admin statistics | Admin only |
| DELETE | `/api/admin/users/:id` | Delete a user | Admin only |

## 🧪 Tests

Unit tests are written for the backend (e.g. `AuthService`). Run them with:

```bash
cd backend
npm test
```

## 📄 License

MIT
