const express = require("express");
const {
  getAllSaves,
  createSave,
  deleteSave,
} = require("../controllers/saveController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllSaves).post(createSave);

router.route("/:saveId").delete(deleteSave);

module.exports = router;
