const { Schema, model } = require('mongoose');

const roomSchema = new Schema(
  {
    title: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    description: { type: String },
    playlistCode: { type: String, required: true, unique: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Room = model('Room', userSchema);

module.exports = Room;
