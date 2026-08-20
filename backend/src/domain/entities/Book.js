class Book {
  constructor({ id, title, author, genre, description, pages, year, status = 'wishlist', rating = null, userId, createdAt = new Date() }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.description = description;
    this.pages = pages;
    this.year = year;
    this.status = status;
    this.rating = rating;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  isOwnedBy(userId) {
    return this.userId === userId;
  }

  toJSON() {
    return {
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
    };
  }
}

module.exports = Book;