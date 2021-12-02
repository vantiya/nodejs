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
    getToursWithin,
    getDistances,
} = require("../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviews");

// const tourController = require("../controllers/tourController");
// console.log(tourController);

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// appRoute.param("id", isTourIdExists);

appRoute.use("/:tourId/reviews", reviewRouter);

appRoute.route("/top-5-cheapest").get(aliasTopCheapest, getAllTours);
appRoute.route("/tour-stats").get(getToursStat);
appRoute
    .route("/monthly-plan/:year")
    .get(
        getMonthlyPlan,
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide")
    );

appRoute
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(getToursWithin);

appRoute.route("/distances/:latlng/unit/:unit").get(getDistances);

appRoute
    .route("/")
    .get(getAllTours)
    .post(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        createTour
    );
appRoute
    .route("/:id")
    .get(getTourById)
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        deleteTour
    );

module.exports = appRoute;
