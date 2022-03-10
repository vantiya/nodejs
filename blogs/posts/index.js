const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

const port = process.env.PORT || 4000;

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title,
    };

    await axios.post('http://localhost:4005/events', {
        type: 'postCreated',
        data: {
            id,
            title,
        },
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event: ', req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log(`Server's running on ${port}`);
});
