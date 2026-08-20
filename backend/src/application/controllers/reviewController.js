const { validationResult } = require('express-validator');
const { ValidationError } = require('../../domain/errors/AppError');

class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
    this.getReviews = this.getReviews.bind(this);
    this.createReview = this.createReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  async getReviews(req, res, next) {
    try {
      const reviews = await this.reviewService.getReviewsByBook(req.params.bookId);
      res.status(200).json({ status: 'success', data: reviews });
    } catch (err) {
      next(err);
    }
  }

  async createReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }
      const review = await this.reviewService.createReview(
        req.user.id,
        req.params.bookId,
        req.body
      );
      res.status(201).json({ status: 'success', data: review });
    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req, res, next) {
    try {
      await this.reviewService.deleteReview(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewController;