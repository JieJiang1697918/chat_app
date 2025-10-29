const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage } = require("./record/message");
const { addUser,
        removeUser,
        getUser,
        getUsersInRoom,
 } = require("./record/user");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.post('/login', (req, res) => {
    const { username, room, password } = req.body;

    if (!rooms[room]) {
        return res.status(400).send('Room does not exist.');
    }

    const validPassword = bcrypt.compareSync(password, rooms[room].passwordHash);
    if (!validPassword) {
        return res.status(401).send('Invalid password.');
    }

    res.redirect(`/chat.html?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`);
});

let message = "Welcome to the Chat Room";

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit(
            "userConnect",
            generateMessage("Admin", "Welcome to the Chat Room")
        );

        socket.broadcast
            .to(user.room)
            .emit(
                "userConnect",
                generateMessage("Admin", `${user.username} has joined`)
            );

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
});


    socket.on("sendMessage", (msg, callback) => {
        const getUserRoom = getUser (socket.id).room;

        io.to(getUserRoom).emit(
            "UserConnect",
            generateMessage(getUser(socket.id).username, message)
        );
    });

    socket.on("fileUpload", ({fileName, fileData}, callback) => {
        const getUserRoom = getUser (socket.id).room;

        io.to(getUserRoom).emit(
            "fileReceived",
            generateMessage(getUser(socket.id).username, fileName, fileData)
        );
    });



    socket.on("disconnect", () => {
        const user = removeUser(stocket.id);

        if (user){
            io.to(user.room).emit(
                "userConnect",
                generateMessage("Admin", `${user.username} has joined`)
            )
        };

            io.to(user.room).emit("roomData",{
                room: user.room,
                user: getUsersInRoom(user,room),
            });        
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});