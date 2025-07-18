"use strict";
// qLkNgESqsNqQL72N
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const financial_records_1 = __importDefault(require("./routes/financial-records"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// MongoDB Connection Options
const mongoURI = "mongodb+srv://Thakki:qLkNgESqsNqQL72N@expenzo.t99gcug.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=expenzo";
// MongoDB Connection Options
const mongoOptions = {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
};
// Connect to MongoDB
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
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
app.use("/financial-records", financial_records_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
