const express = require('express');
const schemas = require('../schemas');
const Review = require('../models/reviews');
const Campground = require('../models/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


const router = express.Router({ mergeParams: true });

const reviewValidation = (req, res, next) => {
    const result = schemas.reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

router.post('/', isLoggedIn, reviewValidation, catchAsync(reviews.newReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroy))

module.exports = router;
