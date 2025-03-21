const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
