const router = require('express').Router();
const Event = require('../models/Event.model');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');

//Create event
router.post('/event', async (req, res, next) => {
  try {
    const { title, description, eventCode, eventPic } = req.body;
    const userId = req.payload.id;
    const newEvent = await Event.create({
      title,
      description,
      eventCode,
      eventPic,
    });
    await User.findByIdAndUpdate(userId, { $push: { events: newEvent._id } });
    await Event.findByIdAndUpdate(newEvent._id, { $push: { collaborators: userId } });
    res.status(201).json(newEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Get all events
router.get('/events', async (req, res, next) => {
  try {
    const allEvents = await Event.find().populate('playlists');
    res.status(200).json(allEvents);
  } catch (error) {
    next(error);
  }
});

//Get single event
router.get('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleEvent = await Event.findById(id).populate('playlists');
    console.log(singleEvent);
    res.status(200).json(singleEvent);
  } catch (error) {
    next(error);
  }
});

//Update event info
router.put('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, eventPic } = req.body;

    let updatedEvent;
    if (req.file) {
      updatedEvent = await Event.findByIdAndUpdate(id, {
        title,
        description,
        eventPic,
      });
    } else {
      updatedEvent = await Event.findByIdAndUpdate(id, {
        title,
        description,
      });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

//Update event by add playlist
router.put('/event/:eventId/add/:playlistId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, eventId } = req.params;
    const updatedByEvent = await Event.findByIdAndUpdate(
      eventId,
      { $push: { playlists: playlistId } },
      { new: true }
    );

    res.status(200).json(updatedByEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Add event image
router.post('/event/:id/upload', fileUploader.single('eventPic'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ fileUrl: req.file.path });
});

//Update event by deleting playlist
router.put('/event/:eventId/delete/:playlistId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, eventId } = req.params;
    const updatedByDel = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { playlists: playlistId } },
      { new: true }
    );

    res.status(200).json(updatedByDel);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Delete event
router.delete('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndRemove(id);

    res.status(200).json(`The event with id: ${id} was sucessfully deleted`);
  } catch (error) {
    next(error);
  }
});

router.put('/addSong/:eventId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { eventId } = req.params;
    const { image, artist, track } = req.body;

    console.log({ image, artist, track });

    const updatedByEvent = await Event.findByIdAndUpdate(
      eventId,
      { $push: { playlists: { image, artist, track } } },
      { new: true }
    );
    console.log(updatedByEvent);
    res.status(200).json(updatedByEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

router.put('/removeSong/:eventId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { eventId } = req.params;
    const { track } = req.body;

    const thisEvent = await Event.findById(eventId);

    const updatedPlaylist = thisEvent.playlists.filter((song) => {
      return song.track != track;
    });

    console.log('este', updatedPlaylist);
    console.log('-------->', track);

    const updatedEvent = await Event.findByIdAndUpdate(eventId, { playlists: updatedPlaylist });

    console.log(thisEvent);
    res.status(200).json(thisEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

module.exports = router;
