// const fs = require("fs");
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

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
