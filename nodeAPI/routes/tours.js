const express = require("express");
const appRoute = express.Router();
const {
    getAllTours,
    createTour,
    getTourById,
    updateTour,
    deleteTour,
    aliasTopCheapest,
    getToursStat,
    getMonthlyPlan,
} = require("../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

// const tourController = require("../controllers/tourController");
// console.log(tourController);

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// appRoute.param("id", isTourIdExists);
appRoute.route("/top-5-cheapest").get(aliasTopCheapest, getAllTours);
appRoute.route("/tour-stats").get(getToursStat);
appRoute.route("/monthly-plan/:year").get(getMonthlyPlan);

appRoute.route("/").get(authController.protect, getAllTours).post(createTour);
appRoute
    .route("/:id")
    .get(getTourById)
    .patch(updateTour)
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        deleteTour
    );

appRoute
    .route("/:tourId/reviews")
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.createReview
    );

module.exports = appRoute;
