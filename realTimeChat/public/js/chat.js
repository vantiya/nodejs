const socket = io();

const btnElement = document.getElementById("send-msg");
const inputElement = document.getElementById("msg-txt");
const formElement = document.getElementById("chat-form");
const locationElement = document.getElementById("share-location")
const messageElement = document.getElementById("messages")

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

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

        const html = Mustache.render(messageTemplate, {
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        })
        messageElement.insertAdjacentHTML('beforeend', html)


        btnElement.removeAttribute("disabled");
        inputElement.value = "";
        inputElement.focus();
        console.log("Message Delivered!", message);
    });
});

socket.on("message", (msg) => {
    console.log(msg);
});

locationElement.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    locationElement.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationElement.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messageElement.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', { username, room })