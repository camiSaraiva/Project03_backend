const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get('/profile/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const id = req.payload._id;
    const { username, email, profilePic } = req.body;

    let profilePictureURL;

    if (req.file) {
      profilePictureURL = req.file.path;
    } else {
      profilePictureURL = profilePic;
    }

    const userUpdateAgain = await User.findByIdAndUpdate(
      id,
      { username, email, profilePictureURL },
      { new: true }
    );
    res.status(200).json(userUpdateAgain);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const id = req.payload._id;

    await User.findByIdAndRemove(id);

    res.status(200).json({ message: 'Profile deleeted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
