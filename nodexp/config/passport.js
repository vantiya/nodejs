const LocalStrategry = require('passport-local').Strategy;
const User = require('../modals/users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new LocalStrategry(function(username, password, done) {
        let query = {username:username};
        User.findOne(query, (error, user) => {
            if(error) {
                return done(error);
            }
            if(!user) {
                return done(null, false, {message: 'User not found!'});
            }

            bcrypt.compare(password, user.password, (error, isMatch) => {
                if(error) {
                    return done(error);
                }
                if(isMatch) {                    
                    return done(null, user);
                } else {                    
                    return done(null, false, {message: 'Incorrect password'});
                }
            })
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}