const express = require('express');
const Campground = require('../models/campground');
require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isOwner} = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");


const router = express.Router();

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, campgrounds.renderNewCampground)

router.post('/new', isLoggedIn, validateCampground, catchAsync(campgrounds.newCampground))

router.get('/:id', catchAsync(campgrounds.renderShowCampground));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditCampground))

router.put('/:id/edit', isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCampground));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(campgrounds.destroyCampground));

module.exports = router;