const express = require("express");
const appRoute = express.Router();
const {
    getAllUsers,
    createUser,
    getUserByID,
    updateUser,
    deleteUser,
    isUserIdExists,
} = require("../controllers/userController");
const authController = require("./../controllers/authController");

appRoute.param("id", isUserIdExists);

appRoute.post("/signup", authController.signup);

appRoute.route("/").get(getAllUsers).post(createUser);
appRoute.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = appRoute;
