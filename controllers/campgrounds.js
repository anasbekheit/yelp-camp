const Campground = require("../models/campground");

function renderNewCampground(req, res) {
    res.render('campgrounds/new');
}

async function newCampground (req, res){
    const campground = new Campground(req.body.campground);
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
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`)
}

async function destroyCampground(req, res){
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground removed!');
    res.redirect('/campgrounds');
}
module.exports = {renderNewCampground, newCampground, renderShowCampground, renderEditCampground, editCampground, destroyCampground}