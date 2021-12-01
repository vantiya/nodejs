const fs = require("fs");
const mongoose = require("mongoose");
const Tours = require("./../../modals/tours");

// Here required to specify path to ENV file
require("dotenv").config({ path: __dirname + "/./../../.env" });
// console.log(process.env);

const DB = process.env.DATABASE.replace("PASSCODE", process.env.PASSWORD);
mongoose.connect(DB).then(console.log("Connection Successfull!"));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tours.create(tours);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tours.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
