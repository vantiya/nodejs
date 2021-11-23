const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
const Tours = require("./modals/tours");

const DB = process.env.DATABASE.replace("PASSCODE", process.env.PASSWORD);
mongoose.connect(DB).then(console.log("Connection Successfull!"));

const newTour = new Tours({
    name: "The Northen Lights",
    description:
        "Enjoy the Northern Lights in one of the best places in the world.",
    price: 1497,
    premium: true,
    rating: 4.9,
});

newTour
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((error) => {
        console.log(error);
    });

const port = process.env.PORT || 3000;
// Start the server
// console.log(process.env);
app.listen(port, () => {
    // console.log(`Server started at http://127.0.0.1:3000`);
    console.log(`Server started at ${process.env.HOST}:${port}`);
});
