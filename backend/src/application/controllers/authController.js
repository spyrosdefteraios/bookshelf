const { validationResult } = require('express-validator');
const { ValidationError } = require('../../domain/errors/AppError');

class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }

      const user = await this.authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }

      const result = await this.authService.login(req.body);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.authService.getProfile(req.user.id);
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;