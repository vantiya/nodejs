const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
let Blogs = require('./modals/blogs');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const messages = require('express-messages');
const config = require('./config/database')

mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', () => {
	console.log("Connected successfully!");
})

// check if db errors
db.on('error', (e) => {
	console.log(e);
});

const app = express();
const port = 3000;

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

// create application/json parser
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
	res.locals.user = req.user || null;
	next();
})

// Home route
app.get('/', (req, res) => {
	Blogs.find({}, (error, blogs) => {
		if(error) {
			console.log(error);
			return
		}
		res.render('index', {
			title: 'Node & Express With some Modules!',
			blogs: blogs,
			// author: req.user.name
		});
	});
});

// Brings in the Blogs route here.
let blogs = require('./routes/blogs');
app.use('/blogs', blogs);

// Brings in the Users route here.
let users = require('./routes/users');
app.use('/users', users);

// Start Server
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});