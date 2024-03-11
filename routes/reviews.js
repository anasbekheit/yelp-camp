const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isAuthor} = require("../utils/middleware");
const reviews = require("../controllers/reviews");


const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))
router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(reviews.deleteReview))

module.exports = router