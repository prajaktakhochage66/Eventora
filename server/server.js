const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");
const cronRoutes = require("./routes/cron");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Eventora Backend is Running"
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.json({
        success: true
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cron", cronRoutes);

// Database Connection
mongoose
    .connect(
        process.env.MONGO_URI ||
        "mongodb://localhost:27017/eventora"
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) =>
        console.error("MongoDB Connection Error:", err)
    );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});