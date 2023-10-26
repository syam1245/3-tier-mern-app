const express = require("express");
const recordRoutes = express.Router();
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

// Endpoint to get all recordsz
recordRoutes.route("/records").get(async (req, res) => {
  try {
    const db_connect = dbo.getDb("employees");
    const records = await db_connect.collection("records").find({}).toArray();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in record.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get a single record by ID
recordRoutes.route("/records/:id").get(async (req, res) => {
  try {
    const db_connect = dbo.getDb("employees");
    const myquery = { _id: new ObjectId(req.params.id) };
    const record = await db_connect.collection("records").findOne(myquery);
    if (!record) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(record);
    }
  } catch (error) {
    console.error("Error in record.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to add a new record
recordRoutes.route("/records/add").post(async (req, res) => {
  try {
    const db_connect = dbo.getDb("employees");
    const { name, position, level } = req.body;
    const myobj = { name, position, level };
    const result = await db_connect.collection("records").insertOne(myobj);

    if (result.ops && result.ops.length > 0) {
      res.status(201).json(result.ops[0]);
    } else {
      res.status(500).json({ error: "Data inserted into database" });
    }
  } catch (error) {
    console.error("Error in record.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a record by ID
recordRoutes.route("/records/update/:id").put(async (req, res) => {
  try {
    const db_connect = dbo.getDb("employees");
    const myquery = { _id: new ObjectId(req.params.id) };
    const { name, position, level } = req.body;
    if (!name || !position || !level) {
      return res.status(400).json({ error: "Incomplete data provided" });
    }
    const newvalues = {
      $set: { name, position, level },
    };
    const result = await db_connect.collection("records").updateOne(myquery, newvalues);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes made to the record" });
    }

    const updatedRecord = await db_connect.collection("records").findOne(myquery);
    res.status(200).json({ message: "Record updated", record: updatedRecord });
  } catch (error) {
    console.error("Error in record.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a record by ID
recordRoutes.route("/records/:id").delete(async (req, res) => {
  try {
    const db_connect = dbo.getDb("employees");
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("records").deleteOne(myquery);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json({ message: "Record deleted" });
    }
  } catch (error) {
    console.error("Error in record.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = recordRoutes;
