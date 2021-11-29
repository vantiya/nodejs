const ApiError = require("./../utils/apiError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new ApiError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    console.log(err.errmsg);
    const val = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(val);
    const message = `Duplicate field value: ${val}. Please use another value.`;
    return new ApiError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalide input data. ${errors.join(". ")}`;
    return new ApiError(message, 400);
};

const handleJWTError = (err) => new ApiError("Invalid Token", 401);

const handleJWTExpiredError = (err) =>
    new ApiError("Token Expired. Login again!", 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational errors
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Generic error for third party error or unknown error
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

// Middleware handler
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV == "development") {
        sendErrorDev(err, res);
    } else {
        // if (process.env.NODE_ENV == "production") {
        let error = { ...err };
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError(error);
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError(error);

        sendErrorProd(err, res);
    }
};
