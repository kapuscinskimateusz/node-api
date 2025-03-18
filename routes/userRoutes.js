const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();

router
  .route("/youngest-3")
  .get(userController.aliasYoungestUsers, userController.getAllUsers);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
