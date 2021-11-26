const express = require("express");
const app = express();

// json middleware to fetch req.body while creating new tour
app.use(express.json());

// API Error Class
const ApiError = require("./utils/apiError");

// errors
const errController = require("./controllers/errorController");

// tours routes
const tourRoutes = require("./routes/tours");
app.use("/api/v1/tours", tourRoutes);

// Users Routes
const userRoutes = require("./routes/users");
app.use("/api/v1/users", userRoutes);

// This wildcard used for some URL/Route that couldn't found - 404
app.get("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this website!`, 400));
});

// Error controller middleware
app.use(errController);

module.exports = app;
