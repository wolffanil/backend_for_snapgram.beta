const Like = require("../models/likeModel");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) return next(new AppError("user id must be", 404));

  const user = await User.findById(userId).lean().populate("posts");

  res.status(200).json({
    status: "seccess",
    data: {
      user,
    },
  });
});

exports.getUserLikedPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) return next(new AppError("user id must be", 404));

  const likedPosts = await Like.find({
    userId,
    commentId: { $in: [null, undefined] },
  })
    .lean()
    .populate("postId")
    .exec();

  const posts = likedPosts.map((item) => item.postId);

  console.log(posts);

  res.status(200).json({
    status: "seccess",
    data: {
      posts,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const { imageUrl, bio, name, username } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      imageUrl,
      bio,
      name,
      username,
    },
    {
      new: true,
    }
  );

  if (!user) return next(new AppError("Error: user not found", 404));

  res.status(200).json({
    status: "seccess",
    data: {
      user,
    },
  });
});

exports.searchUser = catchAsync(async (req, res, next) => {
  const q = req.query.q;

  const users = await User.searchUsers(q);

  res.status(200).json({
    status: "seccess",
    data: {
      users,
    },
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .limit(10)
    .sort({ createAt: "desc" })
    .lean()
    .select("-password -bio -email");

  res.status(200).json({
    data: {
      users,
    },
  });
});
