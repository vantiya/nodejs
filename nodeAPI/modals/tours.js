const mongoose = require("mongoose");
const { Schema } = mongoose;

// console.log(mongoose);

// const tourSchema = new mongoose.Schema({
const tourSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    rating: {
        type: Number,
        required: false,
        default: 4.0,
    },
    price: {
        type: Number,
        required: [true, "A Tour must have a price!"],
    },
    premium: {
        type: Boolean,
        required: false,
        default: false,
    },
    description: {
        type: String,
        required: false,
    },
});

module.exports = Tours = mongoose.model("Tours", tourSchema);
