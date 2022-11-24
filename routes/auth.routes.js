const express = require('express');
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// ℹ️ Handles password encryption
const jwt = require('jsonwebtoken');

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require('../models/User.model');

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log(req.payload);
  res.status(200).json(req.payload);
});

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === '' || password === '' || username === '') {
    res.status(400).json({
      message: 'All fields are mandatory. Please provide your username, email and password.',
    });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).json({ message: error.message });
      } else if (error.code === 11000) {
        res.status(500).json({
          message: 'Email need to be unique. Provide a valid email.',
        });
      } else {
        next(error);
      }
    });
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === '' || password === '') {
    res
      .status(400)
      .json({ message: 'All fields are mandatory. Please, provide email and password.' });
    return;
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // If the user is not found, send an error response
        res.status(400).json({ message: 'Wrong credentials.' });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res.status(400).json({ message: 'Wrong credentials.' });
            return;
          }

          const payload = { id: user._id, email: user.email };

          const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '14d',
          });

          res.status(200).json({ authToken: authToken });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

module.exports = router;
