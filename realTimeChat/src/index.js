const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { emit } = require("process");
const { count } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pubDirPath = path.join(__dirname, "../public");
app.use(express.static(pubDirPath));

io.on("connection", (socket) => {
    console.log("Connected to socket");

    socket.emit("message", "Welcome!");

    socket.on("sendMsg", (msg) => {
        // console.log(msg);
        io.emit("message", msg);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
