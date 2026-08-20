const { IReviewRepository } = require('../../domain/repositories/interfaces');

class InMemoryReviewRepository extends IReviewRepository {
  constructor() {
    super();
    this.reviews = [];
  }

  async findById(id) {
    return this.reviews.find(r => r.id === id) || null;
  }

  async findByBookId(bookId) {
    return this.reviews.filter(r => r.bookId === bookId);
  }

  async save(review) {
    this.reviews.push(review);
    return review;
  }

  async delete(id) {
    this.reviews = this.reviews.filter(r => r.id !== id);
  }
}

module.exports = InMemoryReviewRepository;