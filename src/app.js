const express = require("express");
const { connectDb } = require("./config/database");
const { UserModel } = require("./models/user");
const { validateSignUpData } = require("./utils.js/validate");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const existingUser = await UserModel.findOne({ emailId: req.body.emailId });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hash password", hashPassword);
    const userDetail = {
      ...req.body,
      password: hashPassword,
    };
    const user = new UserModel(userDetail);
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.status(400).send("Error is: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const existingUser = await UserModel.findOne({ emailId });

    if (!existingUser) {
      throw new Error("invalid credentials");
    }
    // const isValid = await bcrypt.compare(password, existingUser.password);
    const isValid = await existingUser.veirfyPassword(password);

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
    res.clearCookie('token', { httpOnly: true });
    res.status(401).send("Error is " + err.message);
  }
});

app.get("/profile/:userId", async (req, res) => {
  const { token } = req.cookies;
  const { userId } = req.params;
  try {
    const decodeToken = jwt.verify(token, "devTiner@68");

    if (decodeToken._id === userId ) {
      const user = await UserModel.findOne({ _id: userId });
      if (user) {
        res.send(user);
      } else {
        throw new Error("not a valid request");
      }
    }else {
      throw new Error("not a valid id");
    }
  } catch (err) {
    res.status(401).send("Error is " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.query.emailId;
  try {
    const users = await UserModel.find({ emailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("User not found");
  }
});

app.get("/getFeeds", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Users not found");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.query.id;
  try {
    const user = await UserModel.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user/:UserId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;

  const ALLOWED_FIELDS = ["photoUrl", "about", "gender", "age", "skills"];
  const isAllowedUpdate = Object.keys(data).every((k) =>
    ALLOWED_FIELDS.includes(k)
  );

  try {
    if (!isAllowedUpdate) {
      throw new Error("Update not allowed");
    }
    const user = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User data updated");
  } catch (err) {
    res.status(500).send("update failed" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Db connect successfully");
    app.listen(7777, () => {
      console.log("app is running on port 7777");
    });
  })
  .catch((err) => {
    console.log(`Db connection not established ${err}`);
  });
