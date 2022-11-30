const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
      lowercase: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default:
        'https://res.cloudinary.com/dophags38/image/upload/v1669839649/app-gallery/g0kr1vfxpmywvink7uk6.jpg',
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
