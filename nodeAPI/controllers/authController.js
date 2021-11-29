const jwt = require("jsonwebtoken");
const User = require("./../modals/users");
const catchAsync = require("./../utils/catchAsync");
require("dotenv").config();

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    // More secure way to restrict what fields shold be added to DB
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
        status: "Success",
        token,
        data: {
            user: newUser,
        },
    });
});
