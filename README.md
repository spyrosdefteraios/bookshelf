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

This makes it easy to swap the storage technology (e.g. from in-memory to MongoDB) without touching the business logic.

## 🚀 Getting Started

### With Docker (recommended)

```bash
docker-compose up --build
```

### Manual Setup

**Backend**
```bash
cd backend
npm install
npm start
```

**Frontend**
```bash
cd frontend
npm install
ng serve
```

## ⚙️ Environment Variables

Create a `.env` file inside `backend/` with the required connection details (MongoDB URI, JWT secret, etc.) — see `docker-compose.yml` for the variables in use.

## ✨ Features

- 🔐 User registration / login with JWT authentication
- 📖 Book search and browsing
- ⭐ Book reviews
- 👤 User profile
- 🛡️ Admin dashboard for catalog management
- 📑 API documentation via Swagger

## 🧪 Tests

```bash
cd backend
npm test
```

## 📄 License

MIT
