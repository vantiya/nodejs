const mongoose = require('mongoose');

let blogSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    author: {
        type: 'string',
        require: true
    },
    content: {
        type: 'string',
        require: true
    }
});

let Blogs = mongoose.model('Blogs', blogSchema);

module.exports = Blogs;