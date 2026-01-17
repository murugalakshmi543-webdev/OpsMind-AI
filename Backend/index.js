require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes);

// Health check (helps debug quickly)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", require("./routes/auth"));

// Connect DB and start server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });
