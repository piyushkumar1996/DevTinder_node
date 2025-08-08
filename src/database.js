const { MongoClient } = require("mongodb");

const URI =
  "mongodb+srv://piyush62kumar:P%40ssw0rd@nodeproject.ixekw3e.mongodb.net/?retryWrites=true&w=majority&appName=nodeProject";

// Connection URL
const url = URI;
const client = new MongoClient(url);

// Database Name
const dbName = "User";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("UserCollection");

  const _data = {
    firstname: "Aswathy",
    lastname: "Ajith",
    phoneNumber: "8910291828",
    city: "Bangalore",
  };
  const insertResult = await collection.insertMany([_data]);
  console.log("Inserted documents =>", insertResult);

  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  // the following code examples can be pasted here...

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());



