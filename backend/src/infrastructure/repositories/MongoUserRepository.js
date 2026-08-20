const { IUserRepository } = require('../../domain/repositories/interfaces');
const UserModel = require('../database/UserModel');

class MongoUserRepository extends IUserRepository {
  async findById(id) {
    const doc = await UserModel.findOne({ id });
    return doc ? doc.toDomain() : null;
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    return doc ? doc.toDomain() : null;
  }

  async save(user) {
    const doc = await UserModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt
    });
    return doc.toDomain();
  }

  async update(id, data) {
    const doc = await UserModel.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true }
    );
    return doc ? doc.toDomain() : null;
  }

  async delete(id) {
    await UserModel.deleteOne({ id });
  }

  async findAll() {
    const docs = await UserModel.find();
    return docs.map(doc => doc.toDomain());
  }
}

module.exports = MongoUserRepository; 