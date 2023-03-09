const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      lowercase: true,
      trim: true
    },
    postImg: {
      type: String,
      trim: true,
      default: 'https://res.cloudinary.com/dulqf7f1b/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1676741904/avatars/avatar-default.jpg'
    },
    owner: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true
    },
    country: {
      ref: 'country',
      type: Schema.Types.ObjectId,
      required: true,
    },
    comments: [{
      ref: 'comment',
      type: Schema.Types.ObjectId
    }],
    votes: [{
      ref: 'vote',
      type: Schema.Types.ObjectId
    }]
  },
  {
    timestamps: true
  }
);

const Post = model("post", postSchema);

module.exports = Post;
