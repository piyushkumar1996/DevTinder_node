const express = require("express");
const { validateSignUpData } = require("../utils.js/validate");

const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const existingUser = await userModel.findOne({ emailId: req.body.emailId });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hash password", hashPassword);
    const userDetail = {
      ...req.body,
      password: hashPassword,
    };
    const user = new userModel(userDetail);
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.status(400).send("Error is: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const existingUser = await userModel.findOne({ emailId });

    if (!existingUser) {
      throw new Error("invalid credentials");
    }
    // const isValid = await bcrypt.compare(password, existingUser.password);
    const isValid = await existingUser.verifyPassword(password);

    if (!isValid) {
      throw new Error("invalid credentials");
    }

    const token = existingUser.getJWT();
    // const token = jwt.sign({ _id: existingUser._id }, "devTiner@68", {expiresIn: '2d'});

    console.log("token is", token);
    res.cookie("token", token, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.send("login successful");
  } catch (err) {
    res.clearCookie("token", { httpOnly: true });
    res.status(401).send("Error is " + err.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.send("logout successful!!");
})

module.exports = {
  authRouter,
};
