const mongoose = require("mongoose");
const Tours = require("./tours");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can't be empty."],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tours",
            require: [true, "Review must belong to tour"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user."],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, async function (next) {
    // this.populate({
    //     path: "tour",
    //     select: "name",
    // }).populate({
    //     path: "user",
    //     select: "name photo",
    // });

    this.populate({
        path: "user",
        select: "name photo",
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    console.log(stats);
    if (stats.length > 0) {
        await Tours.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tours.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};

// Prevent same user to review on same Tour - mean one review on tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post("save", function () {
    this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    // console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

module.exports = Review = mongoose.model("Review", reviewSchema);
