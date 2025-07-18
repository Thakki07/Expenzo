"use strict";
require('dotenv').config(); // Load .env

const express = require("express");
const mongoose = require("mongoose");
const financialRecordRouter = require("./routes/financial-records");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI (from environment)
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI not found in environment.");
  process.exit(1);
}

const mongoOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
};

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, mongoOptions)
  .then(() => {
    console.log("✅ CONNECTED TO MONGODB");
    startServer();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Routes
app.use("/financial-records", financialRecordRouter);

// Error middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

function startServer() {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

// Crash safety
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
