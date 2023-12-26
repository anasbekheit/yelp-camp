const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// ROUTERS
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

// AUTHENTICATION
const passport = require('passport');
const User = require('./models/user');


// DB Connect
const dbURL = 'mongodb://127.0.0.1:27017/yelp-camp';
const connectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose.connect(dbURL, connectOptions);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// App code
const app = express();

// View engine and directory
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// URL requests middleware
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Set static paths
app.use(express.static(path.join(__dirname, 'public')))

// Session settings
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// Flash Messages
app.use(flash());

// Authentication Middleware
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passing information to ejs template Middleware
app.use((req, res, next) => {

    // Keeping track of original url, incase the user logs in he should be redirected to returnTo

    if (!['/', '/login', '/register'].includes(req.originalUrl)){ // Save history if you are not coming from login (prevent infinite loop)
        req.session.returnTo = req.originalUrl;
    }

    // Saving user Info for EJS Mate
    res.locals.currentUser = req.user;

    // Flash templates
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

// Error Handler
app.use((err, req, res) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('stacktrace', {err}); // FOR DEBUGGING PURPOSES.
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});

module.exports = app;