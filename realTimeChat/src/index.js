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
    socket.broadcast.emit("message", "A new user has joinned!");

    socket.on("sendMsg", (msg, callback) => {
        io.emit("message", msg);
        callback("Delivered!");
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
