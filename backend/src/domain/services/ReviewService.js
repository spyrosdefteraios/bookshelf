const { v4: uuidv4 } = require('uuid');
const Review = require('../entities/Review');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');

class ReviewService {
  constructor(reviewRepository, bookRepository) {
    this.reviewRepository = reviewRepository;
    this.bookRepository = bookRepository;
  }

  async getReviewsByBook(bookId) {
    return await this.reviewRepository.findByBookId(bookId);
  }

  async createReview(userId, bookId, data) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new NotFoundError('Book not found');

    const review = new Review({
      id: uuidv4(),
      bookId,
      userId,
      ...data
    });

    return await this.reviewRepository.save(review);
  }

  async deleteReview(id, userId, userRole) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundError('Review not found');
    if (!review.isOwnedBy(userId) && userRole !== 'admin') {
      throw new ForbiddenError('Access denied');
    }
    await this.reviewRepository.delete(id);
  }
}

module.exports = ReviewService;