const express = require("express");
const appRoute = express.Router();
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

appRoute
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.createReview
    );

module.exports = appRoute;
