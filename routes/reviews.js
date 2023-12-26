const express = require('express');
const router = express.Router({mergeParams: true});

const Review = require(`../models/review.js`);
const Campground = require('../models/campground');
require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isAuthor} = require("../utils/middleware");




router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    req.flash('success', 'Review published!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router