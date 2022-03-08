const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

const port = process.env.PORT || 4000;

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title,
    };

    res.status(201).send(posts[id]);
});

app.listen(port, () => {
    console.log(`Server's running on ${port}`);
});
