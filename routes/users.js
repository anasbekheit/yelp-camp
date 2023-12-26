const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../utils/middleware');
const users = require('../controllers/users');


const router = express.Router();

router.get('/register', users.renderRegisterUser);

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.renderLoginUser)

router.post('/login', storeReturnTo,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Incorrect username and/or password'}),
    users.redirectLogin)

router.get('/logout', users.logout);

module.exports = router;
