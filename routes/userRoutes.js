const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router
  .route("/youngest-3")
  .get(userController.aliasYoungestUsers, userController.getAllUsers);

router.route("/user-stats").get(userController.getUserStats);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
