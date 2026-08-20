const mongoose = require('mongoose');
const Book = require('../../domain/entities/Book');

const bookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  genre: { type: String, trim: true },
  description: { type: String, trim: true },
  pages: { type: Number, min: 1 },
  year: { type: Number },
  status: { 
    type: String, 
    enum: ['reading', 'read', 'wishlist'], 
    default: 'wishlist' 
  },
  rating: { type: Number, min: 1, max: 5, default: null },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

bookSchema.methods.toDomain = function () {
  return new Book({
    id: this.id,
    title: this.title,
    author: this.author,
    genre: this.genre,
    description: this.description,
    pages: this.pages,
    year: this.year,
    status: this.status,
    rating: this.rating,
    userId: this.userId,
    createdAt: this.createdAt
  });
};

module.exports = mongoose.model('Book', bookSchema);