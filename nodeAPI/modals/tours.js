const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const { Schema } = mongoose;

// console.log(mongoose);

// const tourSchema = new mongoose.Schema({
const tourSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: [
                40,
                "A tour name must have less or equal then 40 characters",
            ],
            minlength: [
                10,
                "A tour name must have more or equal then 10 characters",
            ],
            // validate: [
            //     validator.isAlpha,
            //     "Tour name must contains characters only.",
            // ], // This also cause an issue with spaces as well so not usefull here
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty is either: easy, medium, difficult",
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message:
                    "Discount price ({VALUE}) should be below regular price",
            },
        },
        premium: {
            type: Boolean,
            required: false,
            default: false,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a description"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false, // - This exclude this field to exclude in API output
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

// Document Middleware : runs before .save() & .create()
// not working for .insert()
tourSchema.pre("save", function (next) {
    // console.log(this);
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Can have multiple middleware
// tourSchema.pre("save", function (next) {
//     console.log(this);
//     next();
// });

// // After save middleware : only work with save and create not with update even
// tourSchema.post("save", function (next) {
//     console.log(this);
//     next();
// });

// Query Middleware
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = new Date();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`This doc takes ${new Date() - this.start} milliseconds`);
    next();
});

// Aggregate Middleware
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});
module.exports = Tours = mongoose.model("Tours", tourSchema);
