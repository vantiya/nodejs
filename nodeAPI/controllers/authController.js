const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../modals/users");
const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/apiError");
const bcrypt = require("bcryptjs");
const sendMail = require("./../utils/email");
require("dotenv").config();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    // Remove Password from Output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    // More secure way to restrict what fields shold be added to DB
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
    // const userLog = await user;
});

exports.logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get the token and if exists
    let token = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    res.locals.user = fetchUser;
    next();
});

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_TOKEN
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    "You don't have permission to perform the action",
                    403
                )
            );
        }
        next();
    };
};

exports.forgotPassword = async (req, res, next) => {
    // Get user by email
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    // If user not found send error
    if (!user) {
        return next(
            new ApiError("User not found with that email address.", 404)
        );
    }

    // Generate Random Token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with a new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password just ignore this email.`;
    try {
        await sendMail({
            email: user.email,
            subject: "Your password reset token (Valid for 10 minutes only",
            message,
        });
        res.status(200).json({
            status: "Success",
            message: "Token sent to email Address!",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new ApiError("There was error sending email, try again later!", 500)
        );
    }
};

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get user token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    console.log(hashedToken);
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // if token isn't expired, there's a user, set new password,
    if (!user) {
        return next(new ApiError("Invalid Token or Expired Token", 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // update changePasswordAt
    // log user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // Current password is correct
    if (
        !user ||
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(new ApiError("Wrong Current Password.", 401));
    }

    // Update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    // log in user - send new token
    createSendToken(user, 200, res);
});
