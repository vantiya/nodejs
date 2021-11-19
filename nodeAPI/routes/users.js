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

appRoute.param("id", isUserIdExists);

appRoute.route("/").get(getAllUsers).post(createUser);
appRoute.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = appRoute;
