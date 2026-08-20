const mongoose = require('mongoose');
const User = require('../../domain/entities/User');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.toDomain = function () {
  return new User({
    id: this.id,
    name: this.name,
    email: this.email,
    passwordHash: this.passwordHash,
    role: this.role,
    createdAt: this.createdAt
  });
};

module.exports = mongoose.model('User', userSchema);