require('dotenv').config();
const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    console.log("Connecting to MongoDB...");

    client.connect()
      .then((db) => {
        _db = db.db("employees");
        console.log("Successfully connected to MongoDB.");
        callback(null); // Pass null to indicate a successful connection
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        callback(err); // Pass the error to the callback
      });
  },
  getDb: function (dbName) {
    return _db || client.db(dbName);
  },
};
