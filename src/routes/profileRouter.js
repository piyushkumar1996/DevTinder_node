const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { userModel } = require("../models/user");
const { validateEditProfile } = require("../utils.js/validate");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error is " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("invalid req body");
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!updatedUser){
      return res.status(404).send('user not found')
    }
    console.log('updated', updatedUser)
    res.json({
      message: "profile edited successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).send("Error is " + err.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    console.log("BODY:", req.body); // Debugging
    const { updatedPassword, oldPassword } = req.body;
    const { user } = req;
    const verifyOldPassword = await user.verifyPassword(oldPassword);
    if (!verifyOldPassword) {
      return res.status(400).send("Old password not valid");
    }
    if (oldPassword === updatedPassword) {
      return res
        .status(400)
        .send("New password cannot be same as old password");
    }

    const hashPassword = await bcrypt.hash(updatedPassword, 10);
    user.password = hashPassword;
    await user.save();

    const token = user.getJWT();

    return res.send("password updated successfully");
  } catch (err) {
    console.log(err)
    res.status(500).send("Error is: " + err.message);
  }
});

module.exports = {
  profileRouter,
};
