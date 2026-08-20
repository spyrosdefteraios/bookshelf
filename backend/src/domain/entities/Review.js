class Review {
  constructor({ id, bookId, userId, text, rating, createdAt = new Date() }) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.text = text;
    this.rating = rating;
    this.createdAt = createdAt;
  }

  isOwnedBy(userId) {
    return this.userId === userId;
  }

  toJSON() {
    return {
      id: this.id,
      bookId: this.bookId,
      userId: this.userId,
      text: this.text,
      rating: this.rating,
      createdAt: this.createdAt
    };
  }
}

module.exports = Review;