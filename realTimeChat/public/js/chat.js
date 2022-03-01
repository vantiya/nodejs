const socket = io();

const btnElement = document.getElementById('send-msg');
const locationElement = document.getElementById('share-location');
const inputElement = document.getElementById('msg-txt');
const formElement = document.getElementById('chat-form');
const messageElement = document.getElementById('messages');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
    '#location-message-template'
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

inputElement.focus();

const autoscroll = () => {
    // New message element
    const newMessage = messageElement.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = messageElement.offsetHeight;

    // Height of messages container
    const containerHeight = messageElement.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = messageElement.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messageElement.scrollTop = messageElement.scrollHeight;
    }
};

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    messageElement.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    messageElement.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    btnElement.setAttribute('disabled', 'disabled');
    const msg = inputElement.value;
    if ('' === msg.trim()) {
        btnElement.removeAttribute('disabled');
        return;
    }

    socket.emit('sendMsg', msg, (error) => {
        btnElement.removeAttribute('disabled');
        inputElement.value = '';
        inputElement.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message Delivered!', msg);
    });
});

locationElement.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    locationElement.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            'sendLocation',
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                locationElement.removeAttribute('disabled');
                console.log('Location shared!');
            }
        );
    });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
