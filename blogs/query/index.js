const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if ('postCreated' === type) {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if ('CommentCreated' === type) {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if ('CommentUpdated' === type) {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find((comment) => comment.id === id);

        comment.status = status;
        comment.content = content;
    }
    res.status(200).send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});
