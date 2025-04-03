const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must have more or equal 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [
      true,
      '"This email is already in use. Please use a different one."',
    ],
    lowercase: true,
    validate: [validator.isEmail, "Email is incorrect"],
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "User role must be either: user, admin",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must have more or equal 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please, confirm your password."],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresIn: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
