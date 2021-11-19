const fs = require("fs");

// Get the tours from json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../api-data/data/tours-simple.json`)
);

exports.isTourIdExists = (req, res, next, val) => {
    const id = val * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `No tour found for matching id ${id}`,
        });
    }
    next();
};

exports.isBodyExists = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "Failed",
            message: "Body required atleast name and price of the product",
        });
    }
    next();
};

// Get all tours
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        total_tours: tours.length,
        tours,
    });
};

// Get tour by id
exports.getTourById = (req, res) => {
    const id = req.param.id * 1;
    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
        status: "success",
        total_tours: 1,
        tour,
    });
};

// Create Tour
exports.createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/../api-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                tour: newTour,
            });
        }
    );
};

// Update Tour
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
    });
};

// Delete Tour
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
    });
};