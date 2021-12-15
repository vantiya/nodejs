const express = require("express");
const appRoute = express.Router();
const {
    getAllUsers,
    createUser,
    getUserByID,
    updateUser,
    deleteUser,
    uploadUserPhoto,
    resizeUserPhoto,
    updateMyData,
    deleteMe,
    getMe,
} = require("./../controllers/userController");
const authController = require("./../controllers/authController");

// appRoute.param("id", isUserIdExists);

appRoute.post("/signup", authController.signup);
appRoute.post("/login", authController.login);
appRoute.get("/logout", authController.logout);
appRoute.post("/forgotPassword", authController.forgotPassword);
appRoute.patch("/resetPassword/:token", authController.resetPassword);

// Middleware works for all ops after this line
appRoute.use(authController.protect);

appRoute.patch("/updateMyPassword", authController.updatePassword);
appRoute.get("/me", getMe, getUserByID);
appRoute.patch("/updateMyData", uploadUserPhoto, resizeUserPhoto, updateMyData);
appRoute.delete("/deleteMe", deleteMe);

appRoute.use(authController.restrictTo("admin"));

appRoute.route("/").get(getAllUsers).post(createUser);
appRoute.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = appRoute;
