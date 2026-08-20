const { IReviewRepository } = require('../../domain/repositories/interfaces');
const ReviewModel = require('../database/ReviewModel');

class MongoReviewRepository extends IReviewRepository {
  async findById(id) {
    const doc = await ReviewModel.findOne({ id });
    return doc ? doc.toDomain() : null;
  }

  async findByBookId(bookId) {
    const docs = await ReviewModel.find({ bookId });
    return docs.map(doc => doc.toDomain());
  }

  async save(review) {
    const doc = await ReviewModel.create({
      id: review.id,
      bookId: review.bookId,
      userId: review.userId,
      text: review.text,
      rating: review.rating,
      createdAt: review.createdAt
    });
    return doc.toDomain();
  }

  async delete(id) {
    await ReviewModel.deleteOne({ id });
  }
}

module.exports = MongoReviewRepository;