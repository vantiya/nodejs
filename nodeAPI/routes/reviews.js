const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

// This merge route with Tour routes
const appRoute = express.Router({ mergeParams: true });

appRoute
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

appRoute
    .route("/:id")
    .get(reviewController.getReviewById)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = appRoute;
