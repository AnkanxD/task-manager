require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ROUTES
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});