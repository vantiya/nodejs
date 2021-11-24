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
        // Filter and retrieve filter fields from query string
        const filterObj = { ...req.query };
        const pageFields = ["page", "limit", "sort", "fields"];
        pageFields.forEach((el) => delete filterObj[el]);

        // Advance Filtering with operator
        const queryStr = JSON.stringify(filterObj).replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        // Method 1
        let query = Tours.find(JSON.parse(queryStr));

        // console.log(req.query, req.query.sort, JSON.parse(queryStr));
        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("createdAt name");
        }

        // Limiting fields that required to fetch - projecting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields + " createdAt");
        } else {
            query = query.select("-__v");
        }

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        // console.log(query);

        if (req.query.page) {
            const numTours = await Tours.countDocuments();
            if (skip >= numTours) throw new Error("This page doesn't exists!");
        }

        // Method 2
        // const tours = await Tours.find()
        //     .where("duration")
        //     .equals(5)
        //     .where("difficulty")
        //     .equals("easy");

        // Method 3
        // const tours = await Tours.find({

        // });

        const tours = await query;
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

const user = (name) => {
    return "hello world";
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
