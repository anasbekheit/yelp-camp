const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const {geoCode} = require('../utils/forwardGeoCode');

async function renderAllCampgrounds(req, res){
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}
function renderNewCampground(req, res) {
    res.render('campgrounds/new');
}

async function newCampground (req, res){
    const location = req.body.campground.location;
    const geoJson = await geoCode(location);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoJson;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Campground successfully created!');
    res.redirect(`/campgrounds/${campground._id}`);
}

async function renderShowCampground(req, res) {
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
}
async function renderEditCampground(req, res) {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Ops Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

async function editCampground(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);

    campground.set({
        ...req.body.campground,
        images: [...campground.images, ...req.files.map(f => ({ url: f.path, filename: f.filename }))],
    });

    if (req.body.deleteImages) {
        req.body.deleteImages.map(filename => cloudinary.uploader.destroy(filename));
        campground.images = campground.images.filter(image => !req.body.deleteImages.includes(image.filename));
    }

    await campground.save();
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`)
}

async function destroyCampground(req, res){
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    campground.images.map(image => cloudinary.uploader.destroy(image.filename));
    req.flash('success', 'Campground removed!');
    res.redirect('/campgrounds');
}
module.exports = {renderAllCampgrounds, renderNewCampground, newCampground, renderShowCampground, renderEditCampground, editCampground, destroyCampground}