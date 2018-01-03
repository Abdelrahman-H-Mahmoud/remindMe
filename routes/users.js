const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated}=require('../helpers/auth');

require('../models/user');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', (req, res,next) => {
    passport.authenticate('local',{
        successRedirect:'/notes',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});


router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password !== req.body.confirmPassword)
        errors.push({ text: 'Passwords do not match' });
    if (req.body.password.length < 4)
        errors.push({ text: 'Passwords must be at least 4 characters' });

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
    }
    else {
        let checkUser = User.findOne({ email: req.body.email }).then(user => {
            if (user){
                req.flash('error_msg', "Email Already Registered");
                res.render('users/register', {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword
                });
            }
            else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg', 'you are now registered');
                            console.log('user saved');
                            res.redirect('/users/login');
                        }).catch(err => {
                            console.log(err);
                            return;
                        });
                    });

                });
            }
        }).catch(err => {
            console.log(err);
        });


    }
});

module.exports = router;