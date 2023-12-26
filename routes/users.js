const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../utils/middleware');


router.get('/register', function (req, res) {
    res.render('./users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate input parameters
        // ...

        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        // Log a specific message or error code instead of the entire error object
        console.log('User registered successfully:', registeredUser);
        req.login(registeredUser, err =>{
            if (err) return next(err);
            req.flash('success', `Welcome ${username} to YelpCamp`);
            res.redirect('/campgrounds');
        });
    } catch (error) {
        // Log a specific message or error code instead of the entire error object
        console.error('Registration error:', error.message);

        req.flash('error', 'Failed to register user. Please try again.');
        res.redirect('register');
    }
}));

router.get('/login', async (req, res) =>{
    res.render('./users/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Incorrect username and/or password'}),
    async (req, res)=>{
    const {username} =  req.user;
    req.flash('success', `Welcome ${username} to YelpCamp`);
    const goToUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(goToUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out!');
        res.redirect('/');
    });
});

module.exports = router;
