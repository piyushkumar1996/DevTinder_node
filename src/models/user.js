const { mongoose } = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 28,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 28,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 60,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "This is the default about you please update",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  return jwt.sign({ _id: user._id }, "devTiner@68", { expiresIn: "2d" });
};

userSchema.methods.veirfyPassword = async function (passwordInputByUser) {
  const user = this;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isValidPassword;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
