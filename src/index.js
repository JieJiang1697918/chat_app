const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage } = require("./record/message");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.emit("message", generateMessage("Welcome to the Chat Room!"));
    socket.broadcast.emit("message", generateMessage("A new user has joined."));

    socket.on("sendMessage", (msg, callback) => {
        io.emit("message", generateMessage(msg));
    });

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left."));
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});