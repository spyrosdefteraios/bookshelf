const { IUserRepository } = require('../../domain/repositories/interfaces');
const User = require('../../domain/entities/User');

class InMemoryUserRepository extends IUserRepository {
  constructor() {
    super();
    this.users = [];
  }

  async findById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email) {
    return this.users.find(u => u.email === email) || null;
  }

  async save(user) {
    this.users.push(user);
    return user;
  }

  async update(id, data) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  async delete(id) {
    this.users = this.users.filter(u => u.id !== id);
  }

  async findAll() {
    return this.users;
  }
}

module.exports = InMemoryUserRepository;