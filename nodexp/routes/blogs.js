const express = require('express');
const router = express.Router();
let Blogs = require('../modals/blogs');
let Users = require('../modals/users');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const messages = require('express-messages');

// Access Control
const isUserLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please logged in to add Blog.');
		res.redirect('/users/login');
	}
};

// Add blog post page
router.get('/add', isUserLoggedIn, (req, res) => {
	res.render('add_blog', {
		title: "Add new Blog",
	})
});

// Handle Add blog post request
router.post('/add', 
	[
		check('title', 'Title is required.').not().isEmpty(),
		check('content', 'Blog content is required.').not().isEmpty()
	],
	(req, res, next) => {
	
	const errors = validationResult(req);
    // console.log(errors.errors.length);
    // console.log(errors);
	if(errors.errors.length > 0) {
		res.render('add_blog', {
			title: "Add new Blog",
			errors: errors.array()
		});
		return;
	}

	let blog = new Blogs();
	blog.title = req.body.title;
	blog.author = req.user._id;
	blog.content = req.body.content;
	
	blog.save((error) => {
		if(error) {
			console.log(error);
			return;
		}        
		req.flash('success', 'Blog Added successfully!');
		res.redirect('/');
	});
});

// Edit Blog
router.get('/edit/:id', isUserLoggedIn, (req, res) => {
	Blogs.findById(req.params.id, (error, blog) => {
		if(error) {
			console.log("Error " + error);
			return;
		}
		Users.findById(blog.author, (error, user) => {
			if( blog.author != req.user._id ) {
				req.flash('danger', 'You are not authorized to edit this post');
				res.redirect('/');
				return;
			}
			res.render('edit_blog', {
				title: "Edit Blog",
				blog, // blog: blog shorthand used here
				author: user.name
			});
		});
	});	
});

// Handle Edit blog post request
router.post('/edit/:id', (req, res) => {
	let blog = {}; // new Blogs();
	blog.title = req.body.title;
	blog.author = req.body.author;
	blog.content = req.body.content;

	let query = {_id:req.params.id}
	
	Blogs.updateOne(query, blog, (error) => {
		if(error) {
			console.log(error);
			return;
		}
		res.redirect('/');
	});
});

// Delete blog by id. Handle delete request
router.delete('/:id', isUserLoggedIn, (req, res) => {
	if (!req.user._id){
		res.status(403).send();
	}
	let query = {_id: req.params.id};

	Blogs.findById(req.params.id, (error, blog) => {
		if(blog.author != req.user._id) {
			res.status(403).send();
		} else {
			Blogs.deleteOne(query, (error) => {
				if(error) {
					console.log('Error '+ error);
					return;
				}
				res.send('Success');
			});
		}
	});
});

// View blog detail page.
router.get('/:id', isUserLoggedIn, (req, res) => {	
	Blogs.findById(req.params.id, (error, blog) => {
		if(error) {
			console.log("Error " + error);
			return;
		}
		Users.findById(blog.author, (error, user) => {
			res.render('blog', {
				blog,
				author: user.name
			});
		});
	});	
});

module.exports = router;