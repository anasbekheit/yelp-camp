const {reviewSchema, campgroundSchema} = require("../schemas");
const ExpressError = require("./ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");


async function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        req.flash('error', 'Please sign-in to continue');
        return res.redirect('/login');
    }
    next();
}
function storeReturnTo (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Campground middleware
function validateCampground (req, res, next){
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
async function isOwner(req, res, next){
    const campgroundId = req.params.id;
    const user = req.user;
    const campground = await Campground.findById(campgroundId);
    if(!campground.owner._id.equals(user._id)){
        return res.redirect(`/campgrounds/${campgroundId}`);  //If the user doesn't own campground redirect him.
    }
    next();
}

// Review middleware

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
async function isAuthor(req, res, next){
    const {id, reviewId} = req.params;
    const user = req.user;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(user._id)){
        return res.redirect(`/campgrounds/${id}`);  //If the user doesn't own campground redirect him.
    }
    next();
}
module.exports = {isLoggedIn, storeReturnTo, validateCampground, validateReview, isOwner, isAuthor}