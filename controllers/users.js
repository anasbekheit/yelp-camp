const User = require("../models/user");

function renderRegisterUser(req, res) {
    res.render('./users/register');
}
async function registerUser(req, res, next){
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
}

async function renderLoginUser(req, res) {
    res.render('./users/login');
}

async function redirectLogin(req, res){
    const {username} =  req.user;
    req.flash('success', `Welcome ${username} to YelpCamp`);
    const goToUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(goToUrl);
}

function logout(req, res, next){
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out!');
        res.redirect('/');
    });
}
module.exports = {renderRegisterUser, registerUser, renderLoginUser, redirectLogin, logout}