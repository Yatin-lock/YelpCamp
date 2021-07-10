const express = require('express');
const router = express.Router();
const ExpressError = require('../utilities/expressError');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campgrounds');
const schemas = require('../schemas');
const { findById } = require('../models/campgrounds');
const { isLoggedIn, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const campgroundValidation = (req, res, next) => {
    const result = schemas.campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

router.get('/', catchAsync(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, campgrounds.newForm)
    .post(isLoggedIn, upload.array('image', 12), campgroundValidation, catchAsync(campgrounds.newPost));

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array('image', 12), campgroundValidation, campgrounds.update)
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroy));


router.get('/:id/edit', isAuthor, catchAsync(campgrounds.updateForm));

module.exports = router;