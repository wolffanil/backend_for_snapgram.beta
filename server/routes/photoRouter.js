const express = require("express");
const {
  resizePostPhoto,
  deletePhoto,
  uploadPhoto,
  resizeProfilePhoto,
  deleteProfilePhoto,
} = require("../controllers/photoController");

const router = express.Router();

router.post("/uploadPhoto", uploadPhoto, resizePostPhoto);

router.delete("/deletePhoto/:photoId", deletePhoto);

router.post("/uploadProfilePhoto", uploadPhoto, resizeProfilePhoto);

router.delete("/deletProfilePhoto/:photoId", deleteProfilePhoto);

module.exports = router;
