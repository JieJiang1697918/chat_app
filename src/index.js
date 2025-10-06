const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let message = "Welcome Socket";

io.on("connection", (socket) => {
    console.log("New WebSocket Connection");
    socket.emit("userConnect", message);
    socket.broadcast.emit("userConnect", "A new user has joined");
    socket.on("sendMessage", (message) => {
        io.emit("userConnect", message)
        console.log(message);
    });
    socket.on("disconnect", () => {
        io.emit("userConnect", "A user has left");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});