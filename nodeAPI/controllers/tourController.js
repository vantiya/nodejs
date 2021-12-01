const ApiError = require("./../utils/apiError");
const Tours = require("./../modals/tours");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

exports.aliasTopCheapest = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingaAverage,price";
    req.query.fields = "name,price,ratingAverage,summary,difficulty";
    next();
};

// Get all tours
exports.getAllTours = factory.getAll(Tours);

// Get tour by id
exports.getTourById = factory.getOne(Tours, { path: "reviews" });

// Create Tour
exports.createTour = factory.creatOne(Tours);

// Update Tour
exports.updateTour = factory.updateOne(Tours);

// Delete Tour
exports.deleteTour = factory.deleteOne(Tours);

exports.getToursStat = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
