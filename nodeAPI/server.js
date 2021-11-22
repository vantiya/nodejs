const app = require("./app");
const dotenv = require("dotenv");
const env = require("./config.env");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
// Start the server
console.log(process.env);
app.listen(3000, () => {
    console.log(`Server started at http:127.0.0.1:3000`);
    // console.log(`Server started at ${process.env.HOST}:${port}`);
});
