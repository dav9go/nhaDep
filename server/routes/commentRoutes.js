import express from "express";
import * as dotenv from "dotenv";

import Comment from "../mongoDB/models/comment.js";
import Post from "../mongoDB/models/post.js";

dotenv.config();

const router = express.Router({ mergeParams: true });

// GET POST COMMENTS

router.route("/post/:postId").get(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "postComments",
      populate: {
        path: "userId",
      },
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all comments from the post",
      error,
    });
  }
});

// DELETE COMMENT

router.route("/delete/post/:postId").put(async (req, res) => {
  console.log("FROM DELETE REQ.PARAMS", req.params);
  try {
    const postId = req.params.postId;
    const commentId = req.body.commentId;

    console.log("FROM DELETE POSTID", postId);
    console.log("FROM DELETE commentID", commentId);
    /** Remove the comment **/
    Comment.findByIdAndRemove(commentId, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("UPDATED POST: ", docs);
      }
    });
    /** Remove the comment from comment array in Post **/
    Post.findByIdAndUpdate(
      postId,
      {
        $pull: { postComments: commentId },
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

    console.log("FROM DELETE commentDeleted", commentDeleted);
    console.log("FROM DELETE postArrayCommentDeleted", postArrayCommentDeleted);

    res.status(201).json({ success: true, data: commentDeleted });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Delete comment error", error });
  }
});

// CREATE COMMENT

router.route("/post/:id").post(async (req, res) => {
  try {
    console.log("req. body:", req.body);
    console.log("req. params:", req.params);

    const body = req.body.description;
    const postId = req.params.id;
    const parentId = req.body.parentId;
    const userId = req.body.userId;

    const newComment = await Comment.create({
      body,
      userId,
      postId,
      parentId,
    });

    console.log("New COMMENT", newComment);

    /** I need to do this because I need to populate the new comment's userId to get the id from the user and the name to update
     * in the new comment added in the moment without reload the page. If I dont do this the user cannot delete or edit
     * the comment because this data is not returned from the backend if I dont do this next lines **/
    const populatedComment = await Comment.findById(newComment._id).populate(
      "userId"
    );

    console.log("populatedComment", populatedComment);

    /** Fill post comments array in Post **/

    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { postComments: newComment._id },
      },
      {
        new: true,
      }
    );

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Fill post comment in Post", error });
  }
});

//EDIT COMMENT

router.route("/edit-comment").put(async (req, res) => {
  console.log("edit COMMENT body", req.body);

  try {
    const updateComment = await Comment.findByIdAndUpdate(
      req.body.id,
      {
        body: req.body.text,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Edited Comment: ", docs);
        }
      }
    );

    res.status(201).json({ succes: true, data: updateComment });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Edit comment error", error });
  }
});

export default router;
