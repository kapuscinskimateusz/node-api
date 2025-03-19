const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User must have a firstName"],
      minlength: [2, "First name must have more or equal 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "User must have a lastName"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      validate: [validator.isEmail, "Email is incorrect"],
    },
    phone: String,
    birthDate: {
      type: Date,
      required: [true, "User must have a birthDate"],
    },
    role: {
      type: String,
      default: "User",
      enum: {
        values: ["User", "Moderator", "Admin"],
        message: "Role must be either: User, Moderator, Admin",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = new Date(this.birthDate);

  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today <
    new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

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

const User = mongoose.model("User", userSchema);

module.exports = User;
