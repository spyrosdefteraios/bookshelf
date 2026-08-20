const { IBookRepository } = require('../../domain/repositories/interfaces');
const BookModel = require('../database/BookModel');

class MongoBookRepository extends IBookRepository {
  async findById(id) {
    const doc = await BookModel.findOne({ id });
    return doc ? doc.toDomain() : null;
  }

  async findByUserId(userId, filters = {}) {
    const query = { userId };
    if (filters.status) query.status = filters.status;
    if (filters.genre) query.genre = filters.genre;
    const docs = await BookModel.find(query);
    return docs.map(doc => doc.toDomain());
  }

  async findAll() {
    const docs = await BookModel.find();
    return docs.map(doc => doc.toDomain());
  }

  async save(book) {
    const doc = await BookModel.create({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      pages: book.pages,
      year: book.year,
      status: book.status,
      rating: book.rating,
      userId: book.userId,
      createdAt: book.createdAt
    });
    return doc.toDomain();
  }

  async update(id, data) {
    const doc = await BookModel.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true }
    );
    return doc ? doc.toDomain() : null;
  }

  async delete(id) {
    await BookModel.deleteOne({ id });
  }
}

module.exports = MongoBookRepository;