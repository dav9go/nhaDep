import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongoDB/models/post.js";
import User from "../mongoDB/models/user.js";
import Comment from "../mongoDB/models/comment.js";

dotenv.config();
const router = express.Router({ mergeParams: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_name: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_API_SECRET,
});

// GET ONE POST

router.route("/post/:postId").get(async (req, res) => {
  const postId = req.params.postId;
  console.log("POSTT IDD", postId);

  try {
    const onePost = await Post.findById(postId).populate("userId");

    res.status(200).json({ success: true, data: onePost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get a post post", error });
  }
});

// GET ALL POSTS

router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("userId");

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Get all posts post", error });
  }
});

// GET USER PRIVATE PROFILE POSTS

router.route("/:page/:userId").get(async (req, res) => {
  try {
    const posts = await User.findById(req.params.userId).populate("posts");

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Get all posts post", error });
  }
});

// CREATE A POST

router.route("/:page/:userId").post(async (req, res) => {
  try {
    console.log("req.body", req.body);
    /** Get the data from req.body **/
    const { title, tags, photo, description, likes, user, userEmail } =
      req.body;

    /** Get the author Id from the URL to find the Author in the database **/
    const author = await User.findById(req.params.userId);

    console.log("author", author);

    /** Create the post **/
    const newPost = await Post.create({
      title,
      tags,
      photo,
      description,
      likes: author._id,
      user,
      userEmail,
      userId: author._id,
    });

    console.log("NEWPOST", newPost);

    /** Update the posts array of the author with the Id of the new post. So later we can populate author posts **/
    author.posts = author.posts.concat(newPost._id);
    await author.save();

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(501).json({ success: false, message: "Create post", error });
  }
});

// LIKE A POST

router.route("/like").put(async (req, res) => {
  try {
    console.log("PUT LIKE postId", req.body.postId);
    console.log("PUT LIKE userId", req.body.authorId);

    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.body.authorId },
      },
      {
        new: true,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("UPDATED POST: ", docs);
        }
      }
    );

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(501).json({ success: false, message: "Like post", error });
  }
});

// UNLIKE A POST

router.route("/unlike").put((req, res) => {
  try {
    console.log("PUT UNLIKE postId", req.body.postId);
    console.log("PUT UNLIKE userId", req.body.authorId);

    const postId = req.body.postId;
    const authorId = req.body.authorId;

    console.log("PUT UNLIKE postId VAR", req.body.postId);
    console.log("PUT UNLIKE userId VAR", req.body.authorId);

    Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: authorId },
      },
      {
        new: true,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("UPDATED POST: ", docs);
        }
      }
    );

    res.status(201).json({ success: true });
  } catch {
    res.status(501).json({ success: false, message: "Like post error", error });
  }
});

// DELETE POST

router.route("/delete").put(async (req, res) => {
  console.log("DELETE POST req.body", req.body);
  try {
    /** DELETE IMAGE ON CLOUDINARY **/
    const deletePhoto = await cloudinary.uploader
      .destroy(req.body.photoId)
      .then((res) => console.log(res));

    /** DELETE ALL THE COMMENTS OF THE POST **/
    const commentDeleted = await Comment.deleteMany({ postId: req.body.id });
    console.log("DELTED COMMENTS:", commentDeleted);

    /** DELETE THE POST ID FROM POSTS ARRAY IN USER SCHEMA **/
    await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { posts: req.body.id },
      },
      {
        new: true,
      }
    );

    console.log("DELTED POST IN USER ARRAY OF POSTS:", commentDeleted);

    /** DELETE POST **/
    await Post.findByIdAndDelete(req.body.id, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("DELETE POST POST: ", docs);
      }
    });

    res.status(201).json({ success: true });
  } catch {
    res.status(501).json({ success: false, message: "Delete post error" });
  }
});

export default router;
