const fs = require("fs");
const Tours = require("./../modals/tours");

// Get the tours from json file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../api-data/data/tours-simple.json`)
// );

// exports.isTourIdExists = (req, res, next, val) => {
//     const id = val * 1;
//     const tour = tours.find((el) => el.id === id);
//     if (!tour) {
//         return res.status(404).json({
//             status: "failed",
//             message: `No tour found for matching id ${id}`,
//         });
//     }
//     next();
// };

// exports.isBodyExists = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "Failed",
//             message: "Body required atleast name and price of the product",
//         });
//     }
//     next();
// };

// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tours.find();
        res.status(200).json({
            status: "success",
            total_tours: tours.length,
            tours,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};

// Get tour by id
exports.getTourById = async (req, res) => {
    try {
        // const id = req.params.id;
        // const tour = tours.find((el) => el.id === id);
        const tour = await Tours.findById(req.params.id);
        res.status(200).json({
            status: "success",
            total_tours: 1,
            tour,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};

// Create Tour
exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tours({});
        // newTour.save().then().catch();
        const newTour = await Tours.create(req.body);
        res.status(201).json({
            status: "success",
            tour: newTour,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};

// Update Tour
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            tour,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};

// Delete Tour
exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tours.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};
