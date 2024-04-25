const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import User model
const User = require('./models/user');

// Create Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/blackjack', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Enable CORS for all routes
app.use(cors());

// POST /api/users/register
app.post('/api/users/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/users/login
app.post('/api/users/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name, password });
    if (!user) {
      return res.status(404).json({ message: 'User not found or incorrect password' });
    }
    const { username, winCount, lossCount, tieCount, balance } = user;
    res.status(200).json({ username, winCount, lossCount, tieCount, balance });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/win/:id
app.put('/api/users/win/:id', async (req, res) => {
  const { id } = req.params;
  const { winCount, balance } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $inc: { winCount }, $set: { balance } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/loss/:id
app.put('/api/users/loss/:id', async (req, res) => {
  const { id } = req.params;
  const { lossCount, balance } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $inc: { lossCount }, $set: { balance } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// PUT /api/users/tie/:id
app.put('/api/users/tie/:id', async (req, res) => {
  const { id } = req.params;
  const { tieCount } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $inc: { tieCount } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
