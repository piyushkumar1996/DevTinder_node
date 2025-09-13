const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",   // references the user model
      index: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: ["accepted", "rejected", "ignored", "interested"],
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// callback should be normal function to access this
connectionRequestSchema.pre('save', function (next){
  const connectionRequest = this;
  // check if the fromUserId and toUserId is same
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself")
  }
  next()
})

const connectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = {
  connectionRequestModel,
};
