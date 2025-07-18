import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI from environment variable
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not set in environment variables.");
  process.exit(1);
}

const mongoOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
};

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose
  .connect(mongoURI, mongoOptions)
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

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Internal Error:", err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
function startServer() {
  app.listen(port, () => {
    console.log(`🚀 Server Running on Port ${port}`);
  });
}

// Handle global errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
