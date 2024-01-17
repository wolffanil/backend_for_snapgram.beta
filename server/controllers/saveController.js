const Save = require("../models/saveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllSaves = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const saves = await Save.find({ userId })
    .lean()
    .populate({
      path: "postId",
      populate: [{ path: "creator" }, { path: "likes" }, { path: "saves" }],
    })
    .sort({ createAt: "desc" });

  res.status(200).json({
    status: "seccess",
    data: {
      saves,
    },
  });
});

exports.deleteSave = catchAsync(async (req, res) => {
  const saveId = req.params.saveId;

  await Save.findByIdAndDelete(saveId);

  res.status(204).json({
    status: "seccess",
  });
});

exports.createSave = catchAsync(async (req, res) => {
  const { userId, postId } = req.body;

  const newSave = await Save.create({ userId, postId });

  res.status(201).json({
    status: "seccess",
    data: {
      save: newSave,
    },
  });
});
