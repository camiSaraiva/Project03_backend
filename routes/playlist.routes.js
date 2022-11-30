const router = require('express').Router();
const Playlist = require('../models/Playlist.model');
const express = require('express');
const fileUploader = require('../config/cloudinary.config');

//Create playlist
router.post('/playlist', async (req, res, next) => {
  try {
    const { title, playlistImg, collaborators, rate } = req.body;
    const newPlaylist = await Playlist.create({
      title,
      playlistImg,
      collaborators,
      rate,
    });
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Get all playlists
router.get('/playlists', async (req, res, next) => {
  try {
    const allPlaylists = await Playlist.find().populate('tracks');
    res.status(200).json(allPlaylists);
  } catch (error) {
    next(error);
  }
});

//Get single playlist
router.get('/playlist/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePlaylist = await Playlist.findById(id).populate('tracks');
    res.status(200).json(singlePlaylist);
  } catch (error) {
    next(error);
  }
});

//Update single playlist info
router.put('/playlist/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, playlistImg, collaborators, rate, tracks } = req.body;

    let playlistImgURL;

    if (req.file) {
      playlistImgURL = req.file.path;
    } else {
      playlistImgURL = playlistImg;
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        title,
        playlistImgURL,
        collaborators,
        rate,
        tracks,
      },
      { new: true }
    );

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
});

//Update playlist by adding track
//PUT http:..../playlist/playlistIDFROMDATABASE/add/trackIdfromSpotify
router.put('/playlist/:playlistId/add/:trackId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, trackId } = req.params;
    const updatedByTrack = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { tracks: trackId } },
      { new: true }
    );

    res.status(200).json(updatedByTrack);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Update playlist by deleting track
router.put('/playlist/:playlistId/delete/:trackId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, trackId } = req.params;
    const updatedByDel = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { tracks: trackId } },
      { new: true }
    );

    res.status(200).json(updatedByDel);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Delete playlist
router.delete('/playlist/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await Playlist.findByIdAndRemove(id);

    res.status(200).json(`The platlist with id: ${id} was sucessfully deleted`);
  } catch (error) {
    next(error);
  }
});

//Playlist image
router.post('/playlist/:id/upload', fileUploader.single('playlistImg'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
