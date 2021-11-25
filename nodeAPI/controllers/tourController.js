const fs = require("fs");
const Tours = require("./../modals/tours");
const APIhelpers = require("./../utils/apiHelper");

exports.aliasTopCheapest = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingaAverage,price";
    req.query.fields = "name,price,ratingAverage,summary,difficulty";
    next();
};
// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        // console.log(req.query, req.query.sort, JSON.parse(queryStr));

        // Method 2
        // const tours = await Tours.find()
        //     .where("duration")
        //     .equals(5)
        //     .where("difficulty")
        //     .equals("easy");

        const getQuery = new APIhelpers(Tours.find(), req.query)
            .filter()
            .sort()
            .getFields()
            .paginate();
        const tours = await getQuery.query;

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
        console.log(req.body);
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

exports.getToursStat = async (req, res) => {
    try {
        const stats = await Tours.aggregate([
            {
                $match: {
                    ratingsAverage: { $gte: 4.5 },
                },
            },
            {
                $group: {
                    // _id: "$ratingsAverage",
                    _id: { $toUpper: "$difficulty" },
                    totalTours: { $sum: 1 },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: {
                    avgPrice: 1,
                },
            },
            // {
            //     $match: {
            //         _id: { $ne: "EASY" },
            //     },
            // },
        ]);
        res.status(200).json({
            status: "success",
            stats,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021

        const plan = await Tours.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { numTourStarts: -1 },
            },
            {
                $limit: 12,
            },
        ]);

        res.status(200).json({
            status: "success",
            data: {
                plan,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err,
        });
    }
};
