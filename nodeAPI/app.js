const express = require("express");
const app = express();

// json middleware to fetch req.body while creating new tour
app.use(express.json());

// tours routes
const tourRoutes = require("./routes/tours");
app.use("/api/v1/tours", tourRoutes);

// Users Routes
const userRoutes = require("./routes/users");
app.use("/api/v1/users", userRoutes);

module.exports = app;
