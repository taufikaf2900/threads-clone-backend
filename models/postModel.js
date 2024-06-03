import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    replies: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          userProfilePic: {
            type: String,
          },
          username: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;
