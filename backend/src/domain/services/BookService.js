const { v4: uuidv4 } = require('uuid');
const Book = require('../entities/Book');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');

class BookService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async getBooks(userId, filters = {}) {
    return await this.bookRepository.findByUserId(userId, filters);
  }

  async getBookById(id, userId) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Book not found');
    if (!book.isOwnedBy(userId)) throw new ForbiddenError('Access denied');
    return book;
  }

  async createBook(userId, data) {
    const book = new Book({
      id: uuidv4(),
      ...data,
      userId
    });
    return await this.bookRepository.save(book);
  }

  async updateBook(id, userId, data) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Book not found');
    if (!book.isOwnedBy(userId)) throw new ForbiddenError('Access denied');
    return await this.bookRepository.update(id, data);
  }

  async deleteBook(id, userId, userRole) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Book not found');
    if (!book.isOwnedBy(userId) && userRole !== 'admin') {
      throw new ForbiddenError('Access denied');
    }
    await this.bookRepository.delete(id);
  }

  async getStats(userId) {
    const books = await this.bookRepository.findByUserId(userId);
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'reading').length,
      read: books.filter(b => b.status === 'read').length,
      wishlist: books.filter(b => b.status === 'wishlist').length,
      avgRating: books.filter(b => b.rating).reduce((acc, b) => acc + b.rating, 0) / books.filter(b => b.rating).length || 0
    };
  }
}

module.exports = BookService;