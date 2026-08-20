const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../entities/User');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../errors/AppError');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ name, email, password, role = 'user' }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({
      id: uuidv4(),
      name,
      email,
      passwordHash,
      role
    });

    return await this.userRepository.save(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user: user.toJSON() };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user.toJSON();
  }
}

module.exports = AuthService;