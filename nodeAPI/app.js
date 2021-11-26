const express = require("express");
const app = express();

// json middleware to fetch req.body while creating new tour
app.use(express.json());

// tours routes
const ApiError = require("./utils/apiError");
const tourRoutes = require("./routes/tours");
app.use("/api/v1/tours", tourRoutes);

// Users Routes
const userRoutes = require("./routes/users");
app.use("/api/v1/users", userRoutes);

// This wildcard used for some URL/Route that couldn't found - 404
app.get("*", (req, res, next) => {
    // res.status(400).json({
    //     status: "Failed",
    //     message: `Can't find ${req.originalUrl} on this website!`,
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this website!`);
    // err.status = "Failed";
    // err.statusCode = 400;

    // next();

    next(new ApiError(`Can't find ${req.originalUrl} on this website!`, 400));
});

// Middleware handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
