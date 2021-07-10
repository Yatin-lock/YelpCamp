const express = require('express');
const Campground = require('../models/campgrounds');
const { findById } = require('../models/campgrounds');
const schemas = require('../schemas');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { cloudinary } = require('../cloudinary');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}
module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}
module.exports.newPost = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews', populate: { path: 'author' }
        })
        .populate('author')
    if (!campground) {
        req.flash('error', 'cannot find that Campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success', `Succesfully Deleted a campground ${camp.title}`);
    res.redirect('/campgrounds');
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...imgs);
    }
    if (req.body.deletedImages) {
        for (let filename of req.body.deletedImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deletedImages } } } });
    }
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success', `Succesfully Updated the campground ${campground.title}`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.updateForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/editForm', { camp });
}