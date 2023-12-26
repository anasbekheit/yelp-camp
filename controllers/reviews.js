const Campground = require("../models/campground");
const Review = require("../models/review");
async function addReview(req, res){
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    req.flash('success', 'Review published!');
    res.redirect(`/campgrounds/${campground._id}`);
}
async function deleteReview(req, res){
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}
module.exports = {addReview, deleteReview}