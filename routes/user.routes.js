const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const user = await User.findById(userId);

    res.status(200).json();
  } catch (error) {}
});
