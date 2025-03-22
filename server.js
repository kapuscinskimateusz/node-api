const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION 💥");

  process.exit(1);
});

require("dotenv").config();
const app = require("./index");

const db = process.env.DATABASE.replace(
  "<DB_PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log("Succesfully connected to the database");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION 💥");

  server.close(() => {
    process.exit(1);
  });
});
