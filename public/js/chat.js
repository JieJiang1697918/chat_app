const socket = io();
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $message = document.querySelector("#messages")
const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("userConnect", (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $message.insertAdjacentHTML("afterbegin", html);
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