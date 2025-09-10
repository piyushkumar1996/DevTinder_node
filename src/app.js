const express = require("express");
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
// Routers
const { authRouter } = require("./routes/authRouter");
const { profileRouter } = require("./routes/profileRouter");
const { connectionRouter } = require("./routes/connectionRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);


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

// app.get("/user", async (req, res) => {
//   const emailId = req.query.emailId;
//   try {
//     const users = await UserModel.find({ emailId });
//     if (users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(404).send("User not found");
//   }
// });

// app.get("/getFeeds", async (req, res) => {
//   try {
//     const users = await UserModel.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(404).send("Users not found");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.query.id;
//   try {
//     const user = await UserModel.findByIdAndDelete(userId);
//     res.send("user deleted successfully");
//   } catch (err) {
//     res.status(500).send("Something went wrong");
//   }
// });

// app.patch("/user/:UserId", async (req, res) => {
//   const data = req.body;
//   const userId = req.params?.userId;

//   const ALLOWED_FIELDS = ["photoUrl", "about", "gender", "age", "skills"];
//   const isAllowedUpdate = Object.keys(data).every((k) =>
//     ALLOWED_FIELDS.includes(k)
//   );

//   try {
//     if (!isAllowedUpdate) {
//       throw new Error("Update not allowed");
//     }
//     const user = await UserModel.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User data updated");
//   } catch (err) {
//     res.status(500).send("update failed" + err.message);
//   }
// });