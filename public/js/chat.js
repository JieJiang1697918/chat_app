const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        if (error){
            return console.log(error);
        }
        console.log("Message Delivered");
    });
});

socket.on("roomData", ({ room, users }) => {
    const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
    const html = Mustache.render(sidebarTemplate, { room, users });
    document.querySelector("#sidebar").innerHTML = html;
});

