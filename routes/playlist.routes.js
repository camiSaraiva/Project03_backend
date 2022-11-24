const router = require('express').Router();
const Playlist = require('../models/Playlist.model');

router.post('/playlists', async (req, res, next) => {
  try {
    const { title, img, collaborators, rate, tracks } = req.body;

    const newPlaylist = await Playlist.create({ title, img, collaborators, rate, tracks });

    res.status(201).json(newPlaylist);
  } catch (error) {
    //This res.json acts more like a console.log, not mandatory

    res.json(error);
    next(error);
  }
});

router.get('/playlist/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const singlePlaylist = await Project.findById(id).populate('tracks');
    res.status(200).json(singlePlaylist);
  } catch (error) {
    next(error);
  }
});

router.put('/playlist/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, img, collaborators, rate, tracks } = req.body;
  
      const updatedPlaylist = await Project.findByIdAndUpdate(
        id,
        { title, img, collaborators, rate, tracks },
      );
  
      res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  });
