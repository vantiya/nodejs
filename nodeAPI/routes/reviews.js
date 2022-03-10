const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

// This merge route with Tour routes
const appRoute = express.Router({ mergeParams: true });

appRoute.use(authController.protect);

appRoute
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo("user"),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

appRoute
    .route("/:id")
    .get(reviewController.getReviewById)
    .patch(
        authController.restrictTo("user", "admin"),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo("user", "admin"),
        reviewController.deleteReview
    );

module.exports = appRoute;
