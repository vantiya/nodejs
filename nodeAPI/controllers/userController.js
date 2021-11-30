const fs = require("fs");
const User = require("./../modals/users");
const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/apiError");

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../api-data/data/users.json`)
);

// Check if user exists
exports.isUserIdExists = (req, res, next, val) => {
    const userID = val;
    const user = users.find((el) => el._id === userID);
    if (!user) {
        return res.status(404).json({
            status: "Failed",
            message: `User not found for the id ${userID}`,
        });
    }
    next();
};
// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "Success",
        total_users: users.length,
        users,
    });
});
// create New User
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
exports.updateMyData = catchAsync(async (req, res, next) => {
    // create error if POST is for update password
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new ApiError(
                "The route isn't for password. Please use /updateMyPassword to udpate password.",
                400
            )
        );
    }

    // Update User record
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        status: "Success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "Success",
        message: "User deleted successfully!",
    });
});
// Fetch user by Id
exports.getUserByID = (req, res) => {
    const userID = req.params.id;
    const user = users.find((el) => el._id === userID);
    res.status(200).json({
        status: "Success",
        user,
    });
};
// User User
exports.updateUser = (req, res) => {
    const userID = req.params.id;
    const user = users.find((el) => el._id === userID);
    res.status(200).json({
        message: "User Updated Successfully",
    });
};
// Delete User
exports.deleteUser = (req, res) => {
    const userID = req.params.id;
    const user = users.find((el) => el._id === userID);
    res.status(200).json({
        message: "User Deleted Successfully",
    });
};
