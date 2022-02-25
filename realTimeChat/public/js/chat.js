const socket = io();

const btnElement = document.getElementById("send-msg");
btnElement.addEventListener("click", () => {
    const msg = document.getElementById("msg-txt").value;
    document.getElementById("msg-txt").value = "";
    socket.emit("sendMsg", msg);
});

socket.on("message", (msg) => {
    console.log(msg);
});
