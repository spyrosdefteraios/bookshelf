require('dotenv').config();
const AuthService = require('../domain/services/AuthService');
const { ConflictError, UnauthorizedError } = require('../domain/errors/AppError');

// Mock repository
class MockUserRepository {
  constructor() {
    this.users = [];
  }
  async findByEmail(email) {
    return this.users.find(u => u.email === email) || null;
  }
  async findById(id) {
    return this.users.find(u => u.id === id) || null;
  }
  async save(user) {
    this.users.push(user);
    return user;
  }
}

describe('AuthService', () => {
  let authService;
  let userRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const user = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });

      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
    });

    test('should throw ConflictError if email already exists', async () => {
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });

      await expect(authService.register({
        name: 'Another User',
        email: 'test@example.com',
        password: '123456'
      })).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    test('should login successfully and return token', async () => {
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: '123456'
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    test('should throw UnauthorizedError with wrong password', async () => {
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError if user not found', async () => {
      await expect(authService.login({
        email: 'notexist@example.com',
        password: '123456'
      })).rejects.toThrow(UnauthorizedError);
    });
  });
});