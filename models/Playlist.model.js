const { Schema, model } = require('mongoose');

const playlistSchema = new Schema(
  {
    title: { type: String, required: true },
    description: {type: String},
    img: { type: String },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rate: [],
    tracks: [],
  },
  {
    timestamps: true,
  }
);

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;
