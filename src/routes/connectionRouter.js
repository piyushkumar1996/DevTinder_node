const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { userModel } = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post(
  "/connection/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const { user } = req;
      const fromUserId = user._id;

      const isValidToUser = await userModel.findOne({ _id: toUserId });

      if (!isValidToUser) {
        return res.status(400).send("user not found");
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("status is not valid");
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exists" });
      }

      const newConnection = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await newConnection.save();
      res.send("connection request successful");
    } catch (err) {
      res.status(500).send("Error is " + err.message);
    }
  }
);

connectionRouter.post(
  "/connection/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.user._id;

      const allowedStatusList = ["accepted", "rejected"];
      if (!allowedStatusList.includes(status)) {
        return res.status(400).send("status is not valid");
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!existingConnectionRequest) {
        return res.status(404).send("Connection request not found");
      }

      existingConnectionRequest.status = status;
      const newConnection = await existingConnectionRequest.save();

      return res.json({
        data: newConnection,
        message: "Request review successfull",
      });

    } catch (err) {
      res.status(500).send("Error is " + err.message);
    }
  }
);


module.exports = {
  connectionRouter,
};
