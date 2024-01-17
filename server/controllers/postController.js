const Post = require("../models/postModel");
const Like = require("../models/likeModel");
const Save = require("../models/saveModel");
const Comment = require("../models/commentModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPosts = catchAsync(async (req, res) => {
  // const posts = await Post.find()
  // .populate({
  //   path: "likes",
  // })
  // .populate({
  //   path: "commentsCount",
  // })
  // .populate({
  //   path: "saves",
  //   select: "userId _id",
  // })
  // .populate({
  //   path: "creator",
  //   select: "-password -bio -email",
  // })
  //   .sort({ createAt: "desc" });
  // res.status(200).json({
  //   status: "seccess",
  //   data: {
  //     posts,
  //   },
  // });

  ///////////////////////////

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 2;

  const skip = (pageNumber - 1) * pageSize;

  const posts = await Post.find()
    .lean()
    .populate({
      path: "likes",
    })
    .populate({
      path: "commentsCount",
    })
    .populate({
      path: "saves",
      select: "userId _id",
    })
    .populate({
      path: "creator",
      select: "-password -bio -email",
    })
    .skip(skip)
    .limit(pageSize)
    .sort({ createAt: "desc" });
  const totalPosts = await Post.countDocuments();
  const hasMore = skip + pageSize < totalPosts;

  res.status(200).json({ posts, hasMore, page: pageNumber });
});

exports.getPostById = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId)
    .lean()
    .populate({
      path: "likes",
    })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "_id name imageUrl",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "likes",
        select: "userId",
      },
    })
    .populate({
      path: "saves",
      select: "userId _id",
    })
    .populate({
      path: "creator",
      select: "-password -bio -email",
    });

  res.status(200).json({
    status: "seccess",
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res) => {
  const { creator, caption, tags, location, imageUrl } = req.body;

  const newPost = await Post.create({
    creator,
    caption,
    tags,
    location,
    imageUrl,
  });

  res.status(200).json({
    status: "seccess",
    data: {
      post: newPost,
    },
  });
});

exports.updatePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const { caption, tags, location, imageUrl } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      caption,
      tags,
      location,
      imageUrl,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "seccess",
    data: {
      post: updatedPost,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;

  if (!postId) return next(new AppError("Id post most be", 404));

  await Post.findByIdAndDelete(postId);

  await Like.deleteMany({ postId });

  await Save.deleteMany({ postId });

  await Comment.deleteMany({ postId });

  res.status(204).json({ status: "seccess" });
});

exports.searchPosts = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.q;

  let posts = await Post.searchPosts(searchTerm);

  res.status(200).json({
    status: "seccess",
    data: {
      posts,
    },
  });
});
