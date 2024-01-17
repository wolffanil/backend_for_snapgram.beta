const express = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
} = require("../controllers/postController");
const commentRouter = require("./commentRouter");

const router = express.Router();

router.use("/:postId/comments", commentRouter);

router.route("/").get(getAllPosts).post(createPost);

router.route("/search").get(searchPosts);

router.route("/:postId").get(getPostById).patch(updatePost).delete(deletePost);

module.exports = router;
