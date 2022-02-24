const path = require("path");
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;
const pubDirPath = path.join(__dirname, "../public");
app.use(express.static(pubDirPath));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
