import mongoose from "mongoose";

const Post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    postComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    user: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PostSchema = mongoose.model("Post", Post);

export default PostSchema;
