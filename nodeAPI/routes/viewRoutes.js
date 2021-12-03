const express = require("express");
const appRoute = express.Router();
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

appRoute.route("/").get(authController.isLoggedIn, viewsController.getOverview);
appRoute.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
appRoute.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
appRoute.get("/me", authController.protect, viewsController.getAccount);

appRoute.post(
    "/submit-user-data",
    authController.protect,
    viewsController.updateUserData
);

module.exports = appRoute;
