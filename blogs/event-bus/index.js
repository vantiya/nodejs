const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = process.env.PORT || 4005;

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    // axios.post('http://localhost:4002/events', event).catch((err) => {
    //     console.log(err.message);
    // });

    res.status(200).send({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
