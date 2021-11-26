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
        sendErrorProd(err, res);
    }
};
