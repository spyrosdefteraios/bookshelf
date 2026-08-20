const { IBookRepository } = require('../../domain/repositories/interfaces');

class InMemoryBookRepository extends IBookRepository {
  constructor() {
    super();
    this.books = [];
  }

  async findById(id) {
    return this.books.find(b => b.id === id) || null;
  }

  async findByUserId(userId, filters = {}) {
    let books = this.books.filter(b => b.userId === userId);

    if (filters.status) {
      books = books.filter(b => b.status === filters.status);
    }

    if (filters.genre) {
      books = books.filter(b => b.genre === filters.genre);
    }

    return books;
  }

  async findAll(filters = {}) {
    return this.books;
  }

  async save(book) {
    this.books.push(book);
    return book;
  }

  async update(id, data) {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;

    const existing = this.books[index];
    Object.assign(existing, data);
    return existing;
  }

  async delete(id) {
    this.books = this.books.filter(b => b.id !== id);
  }
}

module.exports = InMemoryBookRepository;