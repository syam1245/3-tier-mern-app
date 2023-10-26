const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
require("dotenv").config({ path: "./.env" });

const port = process.env.PORT || 5000;

app.use(express.json()); // Body parsing middleware should come before cors middleware.
app.use(cors());

// Import the connectToServer function from conn.js
const { connectToServer } = require("./db/conn");
const recordRoutes = require("./routes/record");

app.use(recordRoutes);

app.listen(port, () => {
  // Perform a database connection when the server starts
  connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
