const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/post', (req, res) => {});

app.listen(port, () => {
    console.log(`Server's running on ${port}`);
});
