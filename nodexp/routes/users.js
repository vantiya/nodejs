const express = require('express');
const router = express.Router();
let Users = require('../modals/users');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const messages = require('express-messages');
const crypt = require('bcryptjs');
const passport = require('passport');

// Registration Form
router.get('/register', (req, res) => {
    res.render('register', {
        title: "Registration Form",
    });
});

// Handle Post request for user registration
// Registration Form
router.post('/register', 
    [
        check('name', 'Name is required.').not().isEmpty(),
		check('email', 'Email is required.').not().isEmpty(),
        check('email', 'Enter Valid email address!').isEmail(),
		check('username', 'Username is required.').not().isEmpty(),
		check('password', 'Password is required.')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
		// check('password2', 'Both Password must be same.').equals()
    ], 
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.errors.length > 0) {
            res.render('register', {
                title: "Registration Form",
                errors: errors.array()
            });
            return;
        }
        let user = new Users({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        
        crypt.genSalt(10, (err, salt) => {
            crypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    consol.log(err);
                }
                user.password = hash;
                user.save((error) => {
                    if(error) {
                        console.log(error);
                        return;
                    }
                    req.flash('success', 'User Added successfully! You can login now.');
                    res.redirect('/users/login');
                })
            })
        });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', 
[
    check('username', 'Username is required.').not().isEmpty(),
    check('password', 'Password is required.').not().isEmpty()
], 
(req, res, next) => {    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out successfully!');
    res.redirect('/users/login');
})
module.exports = router;