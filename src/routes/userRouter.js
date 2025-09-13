const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { connectionRequestModel } = require("../models/connectionRequest");

const userRouter = express.Router();

/* Note: For POST requests: validate all incoming data.
   Note: For GET requests: ensure only the required data is returned, and no extra or sensitive data is exposed.
*/

const populateData = ["firstName", "lastName", "age", "gender", "skills"];

userRouter.get("/user/connection/", userAuth, async (req, res) => {
  try {
    const status = "accepted";
    const loggedInUserId = req.user._id;

    const connectionList = await connectionRequestModel
      .find({
        status,
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .populate("fromUserId", populateData)
      .populate("toUserId", populateData);

    const data = connectionList.map((item) => {
      if (item.fromUserId.equals(loggedInUserId)) {
        return item.toUserId;
      }
      return item.fromUserId;
    });

    return res.json({
      data,
      message: "connection requests fetched successfully",
    });
  } catch (err) {
    res.status(500).send("Error is " + err.message);
  }
});

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const status = "interested";
    const loggedInUserId = req.user._id;

    const connectionList = await connectionRequestModel
      .find({
        status,
        toUserId: loggedInUserId,
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    return res.json({
      data: connectionList,
      message: "connection requests fetched successfully",
    });
  } catch (err) {
    res.status(500).send("Error is " + err.message);
  }
});

module.exports = {
  userRouter,
};
