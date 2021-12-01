const ApiError = require("./../utils/apiError");
const Review = require("./../modals/reviewModal");
const APIhelpers = require("./../utils/apiHelper");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: "Success",
//         results: reviews.length,
//         data: {
//             reviews,
//         },
//     });
// });

// Middleware to set parameters for Create Review with logged user and current tour
exports.setTourUserIds = (req, res, next) => {
    // Allowed nested route
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// Get all Reviews
exports.getAllReviews = factory.getAll(Review);
// Get Review By ID
exports.getReviewById = factory.getOne(Review);
// Create new Reivew with user id and tour id
exports.createReview = factory.creatOne(Review);
// Update Review
exports.updateReview = factory.updateOne(Review);
// Delete Review
exports.deleteReview = factory.deleteOne(Review);
