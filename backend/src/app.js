const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { body } = require('express-validator');
const logger = require('./config/logger');

const { errorHandler, notFound } = require('./infrastructure/middleware/errorHandler');
const { authenticate, authorize } = require('./infrastructure/middleware/auth');

const InMemoryUserRepository = require('./infrastructure/repositories/InMemoryUserRepository');
const InMemoryBookRepository = require('./infrastructure/repositories/InMemoryBookRepository');
const InMemoryReviewRepository = require('./infrastructure/repositories/InMemoryReviewRepository');
const MongoUserRepository = require('./infrastructure/repositories/MongoUserRepository');
const MongoBookRepository = require('./infrastructure/repositories/MongoBookRepository');
const MongoReviewRepository = require('./infrastructure/repositories/MongoReviewRepository');
const { connect } = require('./infrastructure/database/connection');

const AuthService = require('./domain/services/AuthService');
const BookService = require('./domain/services/BookService');
const ReviewService = require('./domain/services/ReviewService');

const AuthController = require('./application/controllers/authController');
const BookController = require('./application/controllers/bookController');
const ReviewController = require('./application/controllers/reviewController');
const AdminController = require('./application/controllers/adminController');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later'
});

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Repositories
const useMongo = process.env.USE_MONGO === 'true';
if (useMongo) connect();

const userRepository = useMongo ? new MongoUserRepository() : new InMemoryUserRepository();
const bookRepository = useMongo ? new MongoBookRepository() : new InMemoryBookRepository();
const reviewRepository = useMongo ? new MongoReviewRepository() : new InMemoryReviewRepository();

// Services
const authService = new AuthService(userRepository);
const bookService = new BookService(bookRepository);
const reviewService = new ReviewService(reviewRepository, bookRepository);

// Controllers
const authController = new AuthController(authService);
const bookController = new BookController(bookService);
const reviewController = new ReviewController(reviewService);
const adminController = new AdminController(userRepository, bookRepository);

// Routes — Auth
app.post('/api/auth/register', authLimiter, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
 body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)')
], authController.register);

app.post('/api/auth/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

app.get('/api/auth/me', authenticate, authController.getProfile);

// Routes — Books
app.get('/api/books', authenticate, bookController.getBooks);
app.get('/api/books/stats', authenticate, bookController.getStats);
app.get('/api/books/:id', authenticate, bookController.getBookById);
app.post('/api/books', authenticate, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required')
], bookController.createBook);
app.put('/api/books/:id', authenticate, bookController.updateBook);
app.delete('/api/books/:id', authenticate, bookController.deleteBook);

// Routes — Reviews
app.get('/api/books/:bookId/reviews', authenticate, reviewController.getReviews);
app.post('/api/books/:bookId/reviews', authenticate, [
  body('text').notEmpty().withMessage('Review text is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], reviewController.createReview);
app.delete('/api/reviews/:id', authenticate, reviewController.deleteReview);

// Routes — Admin
app.get('/api/admin/users', authenticate, authorize('admin'), adminController.getUsers);
app.get('/api/admin/stats', authenticate, authorize('admin'), adminController.getStats);
app.delete('/api/admin/users/:id', authenticate, authorize('admin'), adminController.deleteUser);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;