const express = require("express");
const {
  getUserById,
  getUserLikedPosts,
  updateUser,
  searchUser,
  getUsers,
} = require("../controllers/userController");

const saveRouter = require("./saveRouter");

const router = express.Router();

router.use("/:userId/saves", saveRouter);

router.route("/search").get(searchUser);

router.get("/:userId/liked-posts", getUserLikedPosts);

router.route("/:userId").patch(updateUser).get(getUserById);

router.route("/").get(getUsers);

module.exports = router;
