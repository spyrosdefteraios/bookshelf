const mongoose = require('mongoose');
const Review = require('../../domain/entities/Review');

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.methods.toDomain = function () {
  return new Review({
    id: this.id,
    bookId: this.bookId,
    userId: this.userId,
    text: this.text,
    rating: this.rating,
    createdAt: this.createdAt
  });
};

module.exports = mongoose.model('Review', reviewSchema);