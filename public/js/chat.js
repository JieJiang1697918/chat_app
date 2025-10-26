const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
const $fileTransButton = document.querySelector("#file-transfer");
const $fileInput = document.querySelector("#file-input");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const fileUploadTemplate = document.querySelector("#file-upload").innerHTML;

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const autoscroll = () => {
    const element = $messages.lastElementChildl;
    element.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
    });
};

socket.on("userConnect", (message) => {
    const html = Mustache.render(messageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {

    e.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");
    const message = e.target.elements.message.value;

    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Message Delivered");
    });

});

socket.emit("join", {username, room}, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }

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

