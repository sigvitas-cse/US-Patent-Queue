const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const patentRoutes = require("./routes/patentRoutes");

const app = express();

// CORS configuration
app.use(cors({
  origin: ["https://uspatentq.com", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
}));

// JSON parsing
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patents", patentRoutes);

// Test endpoint
app.get("/api/test", (req, res) => res.json({ status: "ok" }));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));