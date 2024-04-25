// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 1000 // Initial balance for new users
  },
  winCount: {
    type: Number,
    default: 0
  },
  lossCount: {
    type: Number,
    default: 0
  },
  tieCount: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
