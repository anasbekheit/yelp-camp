const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../utils/middleware');
const users = require('../controllers/users');


const router = express.Router();

router.route('/register')
    .get(users.renderRegisterUser)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginUser)
    .post(storeReturnTo,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Incorrect username and/or password'}),
        users.redirectLogin)

router.get('/logout', users.logout);

module.exports = router;
