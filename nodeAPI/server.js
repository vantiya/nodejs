const app = require("./app");

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
