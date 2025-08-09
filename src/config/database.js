const mongoose = require('mongoose');

const URI =
    "mongodb+srv://piyush62kumar:P%40ssw0rd@nodeproject.ixekw3e.mongodb.net/?retryWrites=true&w=majority&appName=nodeProject";

const connectDb = async () => {
    await mongoose.connect(URI)
}

module.exports = { connectDb }