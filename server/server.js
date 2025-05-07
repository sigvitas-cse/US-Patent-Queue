const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const patentRoutes = require('./routes/patentRoutes');

const app = express();

app.use(cors({
  origin: ['https://usptoq-1.onrender.com', 'http://localhost:5173'], // Allow Vite frontend
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/patents', patentRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
