const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const jwtApiKey = "devTiner@68";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedObj = jwt.verify(token, jwtApiKey);

    const user = await UserModel.findOne({ _id: decodedObj._id });
    if (!user) {
      throw new Error("not a valid token");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error is " + err.message);
  }
};

module.exports = {
  userAuth,
};
