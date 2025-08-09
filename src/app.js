const express = require("express");
const { connectDb } = require("./config/database");
const { UserModel } = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Shubham",
    lastName: "kumar",
    email: "shubham_kumar@gmail.com",
    age: 25,
  };

  const user = new UserModel(userObj);

  try {
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.status(400).send("error in saving user data" + err.message);
  }
});

app.get("/user", (req, res) => {
  console.log("user Data fetched");
  res.send("user data----");
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
