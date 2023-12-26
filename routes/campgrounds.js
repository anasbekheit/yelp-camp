const express = require('express');
const Campground = require('../models/campground');
require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isOwner} = require("../utils/middleware");


const router = express.Router();

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Campground successfully created!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate:{
                path: 'author'
            }
        }).populate('owner');
    if (!campground) {
        req.flash('error', 'Ops Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Ops Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn, isOwner, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground removed!');
    res.redirect('/campgrounds');
}));

module.exports = router;