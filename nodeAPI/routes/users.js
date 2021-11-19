const express = require("express");
const appRoute = express.Router();
const {
    getAllUsers,
    createUser,
    getUserByID,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

appRoute.route("/").get(getAllUsers).post(createUser);
appRoute.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = appRoute;
