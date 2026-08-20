class AdminController {
  constructor(userRepository, bookRepository) {
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.getUsers = this.getUsers.bind(this);
    this.getStats = this.getStats.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.userRepository.findAll();
      res.status(200).json({ status: 'success', data: users });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const users = await this.userRepository.findAll();
      const books = await this.bookRepository.findAll();
      res.status(200).json({
        status: 'success',
        data: {
          totalUsers: users.length,
          totalBooks: books.length,
          booksByStatus: {
            reading: books.filter(b => b.status === 'reading').length,
            read: books.filter(b => b.status === 'read').length,
            wishlist: books.filter(b => b.status === 'wishlist').length
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await this.userRepository.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;