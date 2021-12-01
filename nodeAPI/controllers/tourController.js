const ApiError = require("./../utils/apiError");
const Tours = require("./../modals/tours");
const APIhelpers = require("./../utils/apiHelper");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopCheapest = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingaAverage,price";
    req.query.fields = "name,price,ratingAverage,summary,difficulty";
    next();
};

// Get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

// Get tour by id
exports.getTourById = catchAsync(async (req, res, next) => {
    // const tour = await Tours.findById(req.params.id).populate('guides');
    const tour = await Tours.findById(req.params.id);
    if (!tour) {
        return next(
            new ApiError(`No tour found for the id: ${req.params.id}`, 400)
        );
    }
    res.status(200).json({
        status: "success",
        total_tours: 1,
        tour,
    });
});

// Create Tour
exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tours.create(req.body);
    res.status(201).json({
        status: "success",
        tour: newTour,
    });
});

// Update Tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(
            new ApiError(`No tour found for the id: ${req.params.id}`, 400)
        );
    }
    res.status(200).json({
        status: "success",
        tour,
    });
});

// Delete Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tours.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(
            new ApiError(`No tour found for the id: ${req.params.id}`, 400)
        );
    }
    res.status(204).json({
        status: "success",
    });
});

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
