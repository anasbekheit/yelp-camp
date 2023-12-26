const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isOwner} = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");


const router = express.Router();

router.get('/', catchAsync(campgrounds.renderAllCampgrounds));

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewCampground)
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.newCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.renderShowCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.destroyCampground))

router.route('/:id/edit')
    .get(isLoggedIn, isOwner, catchAsync(campgrounds.renderEditCampground))
    .put(isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCampground))


module.exports = router;