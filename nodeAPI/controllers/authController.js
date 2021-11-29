const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../modals/users");
const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/apiError");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    // More secure way to restrict what fields shold be added to DB
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: "Success",
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // Check if user exists
    if (!email || !password) {
        return next(new ApiError("Please provide email and password", 400));
    }

    // Check if credentials are correct
    const user = await User.findOne({ email }).select("+password");
    // const correct = await User.correctPassword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    // If user and credentials are correct success
    const token = signToken(user._id);
    res.status(200).json({
        status: "Success",
        token,
    });
    // const userLog = await user;
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get the token and if exists
    let token = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token === "") {
        return next(new ApiError("Unauthorized Access!", 401));
    }
    // 2. Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);
    // 3. validate user
    const fetchUser = await User.findById(decoded.id);
    if (!fetchUser) {
        return next(
            new ApiError("The User belong to the token no longer exists", 401)
        );
    }
    // 4. check if user has changed password after token generated
    if (fetchUser.changePasswordAfter(decoded.iat)) {
        return next(
            new ApiError(
                "You seems to have changed password. login again!",
                401
            )
        );
    }

    // Grand access to protect route
    req.user = fetchUser;
    next();
});
