const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user)
                return done(null, false, { message: 'no user found' });
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user)
                }
                else
                    return done(null, false, { message: 'invalid email or password' });
            }).catch(err => {
                console.log(err);
            })

        }).catch(err => {

        })
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