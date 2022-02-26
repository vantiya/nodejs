const socket = io();

const btnElement = document.getElementById("send-msg");
const inputElement = document.getElementById("msg-txt");
const formElement = document.getElementById("chat-form");

inputElement.focus();

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    btnElement.setAttribute("disabled", "disabled");
    const msg = inputElement.value;
    if ("" === msg.trim()) {
        btnElement.removeAttribute("disabled");
        return;
    }

    socket.emit("sendMsg", msg, (message) => {
        btnElement.removeAttribute("disabled");
        inputElement.value = "";
        inputElement.focus();
        console.log("Message Delivered!", message);
    });
});

socket.on("message", (msg) => {
    console.log(msg);
});
