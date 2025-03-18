require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./../models/userModel");

const db = process.env.DATABASE.replace(
  "<DB_PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log("Succesfully connected to the database!");
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await User.create(users);
    console.log("Data successfully imported");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
