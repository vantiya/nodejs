const fs = require("fs");
const express = require("express");
const app = express();

// json middleware to fetch req.body while creating new tour
app.use(express.json());

// Get the tours from json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/api-data/data/tours-simple.json`)
);

// Get all tours
app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        total_tours: tours.length,
        tours,
    });
});

// Get tour by id
app.get("/api/v1/tours/:id", (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `No tour found for matching id ${id}`,
        });
    }
    res.status(200).json({
        status: "success",
        total_tours: 1,
        tour,
    });
});

// Create Tour
app.post("/api/v1/tours", (req, res) => {
    console.log(req);
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/api-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                tour: newTour,
            });
        }
    );
});

// Update Tour
app.patch("/api/v1/tours/:id", (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `No tour found for the id ${id}`,
        });
    }
    res.status(200).json({
        status: "success",
    });
});

// Delete Tour
app.delete("/api/v1/tours/:id", (req, res) => {
    res.status(204).json({
        status: "success",
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
