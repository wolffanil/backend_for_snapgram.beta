const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");

const authRouter = require("./routes/authRouter");
const photoRouter = require("./routes/photoRouter");
const postRouter = require("./routes/postRouter");
const saveRouter = require("./routes/saveRouter");
const likeRouter = require("./routes/likeRouter");
const globalError = require("./controllers/errorController");
const commentRouter = require("./routes/commentRouter");
const userRouter = require("./routes/userRouter");

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    // origin: "http://127.0.0.1:5173/",
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/upload", express.static(path.join(__dirname, "upload")));

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photo", photoRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/saves", saveRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can dont use this ${req.originalUrl}`, 404));
});

app.use(globalError);

module.exports = app;
