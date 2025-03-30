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
    enum: {
      values: ["User", "Admin"],
      default: "User",
      message: "User must be either: User, Admin",
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

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: [true, "User must have a firstName"],
//       minlength: [2, "First name must have more or equal 2 characters"],
//     },
//     lastName: {
//       type: String,
//       required: [true, "User must have a lastName"],
//     },
//     email: {
//       type: String,
//       required: [true, "User must have an email"],
//       validate: [validator.isEmail, "Email is incorrect"],
//     },
//     phone: String,
//     birthDate: {
//       type: Date,
//       required: [true, "User must have a birthDate"],
//     },
//     role: {
//       type: String,
//       default: "User",
//       enum: {
//         values: ["User", "Moderator", "Admin"],
//         message: "Role must be either: User, Moderator, Admin",
//       },
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now(),
//       select: false,
//     },
//     secretUser: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// userSchema.virtual("age").get(function () {
//   const today = new Date();
//   const birthDate = new Date(this.birthDate);

//   let age = today.getFullYear() - birthDate.getFullYear();
//   if (
//     today <
//     new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
//   ) {
//     age--;
//   }

//   return age;
// });

// userSchema.pre("save", function (next) {
//   console.log(this);
//   next();
// });

// userSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   this.find({ secretUser: { $ne: true } });
//   next();
// });

// userSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { firstName: "Ewa" } });
//   next();
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
