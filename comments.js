// Create web server

// Import modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Import models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Load validation
const validateCommentInput = require("../../validation/comment");

// @route   GET api/comments/test
// @desc    Test comments route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Comments works" }));

// @route   POST api/comments/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Validate input
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    try {
      // Find post by id
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ post: "Post not found" });

      // Create new comment
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar
      };

      // Add to comments array
      post.comments.unshift(newComment);

      // Save to database
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// @route   DELETE api/comments/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Find post by id
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ post: "Post not found" });

      // Find comment by id
      const comment = post.comments.find(
        comment => comment.id === req.params.comment_id
      );
      if (!comment) return res.status(404).json({ comment: "Comment not found" });

      // Check if user is owner of comment
      if