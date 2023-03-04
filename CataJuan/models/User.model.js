const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      lowercase: true,
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      lowercase: true,
      trim: true
    },
    avatar: {
      type: String,
      trim: true,
      default: 'https://res.cloudinary.com/dulqf7f1b/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1676741904/avatars/avatar-default.jpg'
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email must be unique.'],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

const User = model("user", userSchema);

module.exports = User;
