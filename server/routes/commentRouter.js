const express = require("express");
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentById,
} = require("../controllers/commentController");

const router = express.Router({ mergeParams: true });

router.route("/").post(createComment).get(getAllComments);

router
  .route("/:commentId")
  .patch(updateComment)
  .delete(deleteComment)
  .get(getCommentById);

module.exports = router;
