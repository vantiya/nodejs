const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
const posts = {};

const port = process.env.PORT || 4000;

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/post', (req, res) => {
    randomBytes = randomBytes(4).toString('hex');
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
