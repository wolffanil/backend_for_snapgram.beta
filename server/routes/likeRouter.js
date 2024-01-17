const express = require("express");
const { createLike, deleteLike } = require("../controllers/likeController");

const router = express.Router();

router.route("/").post(createLike);

router.route("/:likeId").delete(deleteLike);

module.exports = router;
