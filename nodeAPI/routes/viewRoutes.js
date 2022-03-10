const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const appRoute = express.Router();

appRoute.use(viewsController.alerts);
appRoute.route("/").get(authController.isLoggedIn, viewsController.getOverview);
appRoute.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
appRoute.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
appRoute.get("/me", authController.protect, viewsController.getAccount);

appRoute.get(
    "/my-tours",
    bookingController.createBookingCheckout,
    authController.protect,
    viewsController.getMyTours
);
appRoute.post(
    "/submit-user-data",
    authController.protect,
    viewsController.updateUserData
);

module.exports = appRoute;
