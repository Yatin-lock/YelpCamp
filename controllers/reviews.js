const Review = require('../models/reviews');
const Campground = require('../models/campgrounds');

module.exports.newReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Added your review!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted your Review');
    res.redirect(`/campgrounds/${id}`);
}