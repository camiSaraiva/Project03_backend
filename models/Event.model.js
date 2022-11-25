const { Schema, model } = require('mongoose');

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    eventCode: { type: String, required: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  },
  {
    timestamps: true,
  }
);

const Event = model('Event', eventSchema);

module.exports = Event;
