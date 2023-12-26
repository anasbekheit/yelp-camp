const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isOwner} = require("../utils/middleware");
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');

// File uploading handling
const upload = multer({storage});

const router = express.Router();

router.get('/', catchAsync(campgrounds.renderAllCampgrounds));

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewCampground)
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.newCampground));

router.route('/:id')
    .get(catchAsync(campgrounds.renderShowCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.destroyCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isOwner, catchAsync(campgrounds.renderEditCampground))
    .put(isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCampground));


module.exports = router;