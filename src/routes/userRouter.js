const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { userModel } = require("../models/user");

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

userRouter.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 4;
    limit = Math.min(limit, 10)
    const skip = (page - 1) * limit;

    const connection = await connectionRequestModel.find(
      {
        fromUserId: loggedInUserId,
      },
      "toUserId"
    );

    const connectionMap = new Set();
    connection.forEach((item) => {
      connectionMap.add(item.toUserId.toString());
    });
    connectionMap.add(loggedInUserId);

    const [users, total] = await Promise.all([
      userModel
        .find(
          { _id: { $nin: Array.from(connectionMap) } },
          "firstName lastName gender age"
        )
        .skip(skip)
        .limit(limit)
        .lean(),
      userModel.countDocuments({ _id: { $nin: Array.from(connectionMap) } }),
    ]);

    return res.json({
      data: { users, total },
      message: "User feed data",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  userRouter,
};
