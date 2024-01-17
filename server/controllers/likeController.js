const Like = require("../models/likeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createLike = catchAsync(async (req, res) => {
  const { userId, postId, commentId } = req.body;

  const newLike = await Like.create({
    userId,
    postId: postId || undefined,
    commentId: commentId || undefined,
  });

  if (!newLike) return next(new AppError("like not created", 404));

  res.status(201).json({
    status: "success",
    data: {
      like: newLike,
    },
  });
});

exports.deleteLike = catchAsync(async (req, res) => {
  const likeId = req.params.likeId;

  await Like.findByIdAndDelete(likeId);

  res.status(204).json({
    status: "seccess",
  });
});
