const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Like = require("../models/likeModel");

exports.createComment = catchAsync(async (req, res, next) => {
  const { postId, author, text, parentId } = req.body;

  const newComment = await Comment.create({
    postId: postId || undefined,
    author,
    text,
    parentId: parentId || undefined,
  });

  if (!newComment) return next(new AppError("Comment not created", 404));

  res.status(201).json({
    status: "seccess",
    data: {
      comment: newComment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  let comments;

  if (!req.params.postId) {
    comments = await Comment.find();
  } else {
    comments = await Comment.find({ postId: req.params.postId })
      .populate({
        path: "author",
      })
      .populate({
        path: "likes",
        // populate: {
        //   path: "userId",
        //   select: "_id",
        // },
      });
  }

  res.status(200).json({
    status: "seccess",
    data: {
      comments,
    },
  });
});

exports.getCommentById = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;

  if (!commentId) return next(new AppError("Id most be!", 404));

  const comment = await Comment.findById(commentId)
    .lean()
    .populate({
      path: "children",
      populate: {
        path: "likes",
      },
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        select: "_id name imageUrl",
      },
    })
    .populate("likes")
    .populate("author", "_id name imageUrl");

  res.status(200).json({
    status: "seccess",
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;

  if (!commentId) return next(new AppError("Id most be!", 404));

  await Comment.findByIdAndDelete(commentId);

  await Like.deleteMany({ commentId });

  await Comment.deleteMany({ parentId: commentId });

  res.status(204).json({ status: "seccess" });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;

  const { text } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment)
    return next(
      new AppError("comment not updated, please try again late", 404)
    );

  res.status(200).json({
    data: {
      comment,
    },
  });
});
