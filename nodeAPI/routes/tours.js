const express = require("express");
const appRoute = express.Router();
const {
    getAllTours,
    createTour,
    getTourById,
    updateTour,
    deleteTour,
    isTourIdExists,
    isBodyExists,
} = require("../controllers/tourController");

// const tourController = require("../controllers/tourController");
// console.log(tourController);

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

appRoute.param("id", isTourIdExists);

appRoute.route("/").get(getAllTours).post(isBodyExists, createTour);
appRoute.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = appRoute;
