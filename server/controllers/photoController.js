const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadPhoto = upload.single("image");

exports.resizePostPhoto = catchAsync(async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "The file not exist",
    });

  req.file.filename = `post-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`upload/imagePost/${req.file.filename}`);

  res.status(200).json({
    status: "seccess",
    imageUrl: `${process.env.SERVER_URL}upload/imagePost/${req.file.filename}`,
  });
});

exports.deletePhoto = catchAsync(async (req, res) => {
  const photoId = req.params.photoId;

  const filePath = path.join(__dirname, "../upload/imagePost", photoId);

  await fs.unlink(filePath);
  res.status(200).json({
    status: "seccess",
  });
});

exports.resizeProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "The file not exist",
    });

  req.file.filename = `profile-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(54, 54)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`upload/imageProfile/${req.file.filename}`);

  res.status(200).json({
    status: "seccess",
    imageUrl: `${process.env.SERVER_URL}upload/imageProfile/${req.file.filename}`,
  });
});

exports.deleteProfilePhoto = catchAsync(async (req, res) => {
  const photoId = req.params.photoId;

  const filePath = path.join(__dirname, "../upload/imageProfile", photoId);

  await fs.unlink(filePath);
  res.status(200).json({
    status: "seccess",
  });
});
