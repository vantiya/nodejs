const path = require("path");
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

// API Error Class
const ApiError = require("./utils/apiError");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Set Security HTTP Headers
// app.use(helmet());
/* app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "default-src": ["'self'", "data:", "blob:"],
            "font-src": ["'self'", "https:", "data:", "unsafe-inline"],
            "script-src": ["'self'", "unsafe-inline"],
            "style-src": ["'self'", "https:", "unsafe-inline"],
        },
    })
); */
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", "http://127.0.0.1:3000/*"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            scriptSrc: ["'self'", "https://*.cloudflare.com"],
            scriptSrc: [
                "'self'",
                "https://*.stripe.com",
                "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js",
            ],
            frameSrc: ["'self'", "https://*.stripe.com"],
            objectSrc: ["'none'"],
            styleSrc: ["'self'", "https:", "unsafe-inline"],
            connectSrc: ["self", "ws://localhost:45129/"],
            upgradeInsecureRequests: [],
        },
    })
);

// json middleware to fetch req.body while creating new tour & limit JSON size in request body
app.use(express.json({ limit: "5000kb" }));
app.use(express.urlencoded({ extended: false, limit: "5000kb" }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(expressMongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// HTTP Paramerter Polution
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverate",
            "difficulty",
            "price",
        ],
    })
);

//
// Test middleware
app.use((req, res, next) => {
    // req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// Set Request limit per IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP. Please try it again.",
});
app.use("/api", limiter);

// errors
const errController = require("./controllers/errorController");

// View Routes
const viewRouter = require("./routes/viewRoutes");
app.use("/", viewRouter);

// tours routes
const tourRoutes = require("./routes/tours");
app.use("/api/v1/tours", tourRoutes);

// Users Routes
const userRoutes = require("./routes/users");
const ExpressMongoSanitize = require("express-mongo-sanitize");
app.use("/api/v1/users", userRoutes);

// Review Routes
const reviewRoutes = require("./routes/reviews");
app.use("/api/v1/reviews", reviewRoutes);

// This wildcard used for some URL/Route that couldn't found - 404
app.get("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this website!`, 400));
});

// Error controller middleware
app.use(errController);

module.exports = app;
