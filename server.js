const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

// config Express.js
app.use(express.json());
app.use(cors());

// Connecting to the database
var db;
// the connection string for connecting to a MongoDB database.
const uri = "mongodb+srv://Deji:Ayodeji005@cluster0.lnn7tna.mongodb.net/";
// try and catch creates a connection to the MongoDB database and handle any potential errors.
try {
  const client = new MongoClient(uri);
  db = client.db("webstore");
  console.log("Successfully connected to MongoDB!");
} catch (e) {
  console.error("Database connection failed. - Error:" + e);
}

// Logger Middleware
app.use((req, res, next) => {
  var log = `${req.ip} -- ${req.method} ${req.path} ${res.statusCode}"`;
  console.log(log, req.body);
  next();
});

app.get("/", async (req, res) => {
  // db.collection('lessons').updateMany({}, { $set: { avaliability: 5 } });
  var test = await db.collection("lessons").find({}).toArray()
  console.log(test)
  res.send("Select a collection, e.g., /collection/lessons");
});

// retrieve all the object from an collection
app.get("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .find({})
      .toArray()
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// Search
app.get("/search/collection/lessons/", (req, res) => {
  try {
    var search = req.query.search;
    var sort = req.query.sort || "title";
    var order = req.query.order == "desc" ? -1 : 1;
    if (search) {
      console.log('New Search: ', search)
    }
    if (search) {
      search = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    } else {
      search = {};
    }

    db.collection("lessons")
      .find(search)
      .sort({ [sort]: order })
      .toArray()
      .then((results) => {
        res.send(results); //sends the resulting array of documents as the response to the client.
      });
  } catch (error) {
    console.log(error);
  }
});

//to insert a document to the collection
app.post("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .insertOne(req.body)
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.get("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//to update a document by ID
app.put("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Express.js server running at PORT 3000");
});
