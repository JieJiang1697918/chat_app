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
    console.log("Nwe WebSocket Connection");
    socket.emit("userConnect", message);
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});