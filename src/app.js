const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("This is the Test url");
})

app.use("/hello", (req, res) => {
    res.send("This is hello from the server");
})

app.use("/" , (req, res) => {
    res.send("This is the base url");
})

app.listen(7777, () => {
    console.log("app is running on port 7777")
})