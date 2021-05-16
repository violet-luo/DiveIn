const Divesite = require('../models/divesite');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const divesite = await Divesite.findById(req.params.id);
    const review = new Review(req.body.review);	
    review.author = req.user._id;
    divesite.reviews.push(review);
    await review.save();
    await divesite.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/divesites/${divesite._id}`);	
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Divesite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/divesites/${id}`);
}

