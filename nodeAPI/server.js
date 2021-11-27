const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
const Tours = require("./modals/tours");

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

const DB = process.env.DATABASE.replace("PASSCODE", process.env.PASSWORD);
mongoose.connect(DB).then(console.log("Connection Successfull!"));

const port = process.env.PORT || 3000;
// Start the server
// console.log(process.env);
app.listen(port, () => {
    // console.log(`Server started at http://127.0.0.1:3000`);
    console.log(`Server started at ${process.env.HOST}:${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled Rejection! Shutting Down...");
    server.close(() => {
        process.exit(1);
    });
});
