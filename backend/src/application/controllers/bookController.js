const { validationResult } = require('express-validator');
const { ValidationError } = require('../../domain/errors/AppError');

class BookController {
  constructor(bookService) {
    this.bookService = bookService;
    this.getBooks = this.getBooks.bind(this);
    this.getBookById = this.getBookById.bind(this);
    this.createBook = this.createBook.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  async getBooks(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        genre: req.query.genre
      };
      const books = await this.bookService.getBooks(req.user.id, filters);
      res.status(200).json({ status: 'success', data: books });
    } catch (err) {
      next(err);
    }
  }

  async getBookById(req, res, next) {
    try {
      const book = await this.bookService.getBookById(req.params.id, req.user.id);
      res.status(200).json({ status: 'success', data: book });
    } catch (err) {
      next(err);
    }
  }

  async createBook(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }
      const book = await this.bookService.createBook(req.user.id, req.body);
      res.status(201).json({ status: 'success', data: book });
    } catch (err) {
      next(err);
    }
  }

  async updateBook(req, res, next) {
    try {
      const book = await this.bookService.updateBook(req.params.id, req.user.id, req.body);
      res.status(200).json({ status: 'success', data: book });
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req, res, next) {
    try {
      await this.bookService.deleteBook(req.params.id, req.user.id, req.user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.bookService.getStats(req.user.id);
      res.status(200).json({ status: 'success', data: stats });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BookController;