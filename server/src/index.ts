// qLkNgESqsNqQL72N

import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection Options
const mongoURI: string = "mongodb+srv://Thakki:qLkNgESqsNqQL72N@expenzo.t99gcug.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=expenzo";

// MongoDB Connection Options
const mongoOptions = {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose
  .connect(mongoURI, mongoOptions)
  .then(() => {
    console.log("CONNECTED TO MONGODB!");
    // Start server only after successful database connection
    startServer();
  })
  .catch((err) => {
    console.error("Failed to Connect to MongoDB:", err);
    process.exit(1);
  });

// Routes
app.use("/financial-records", financialRecordRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server function
function startServer() {
  app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});