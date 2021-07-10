const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = "pk.eyJ1Ijoienlncm9tZWNvZGVzIiwiYSI6ImNrcW9pZWRpZzA0NnoycmxjZXczdWFoejEifQ.gpNeTaurFG9MUmWhSKilFQ";
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(p => {
        console.log('connected');
    })
    .catch(err => {
        console.log('connection error');
    })
const randTitle = arr => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const city = cities[random1000].city;
        const state = cities[random1000].state;
        const descriptor = randTitle(descriptors);
        const place = randTitle(places);
        const geoData = await geoCoder.forwardGeocode({
            query: `${city}, ${state}`,
            limit: 1
        }).send()
        const camp = new Campground({
            author: "60d4a0750ea3ab0dc0d107c5",
            location: `${city}, ${state}`,
            title: `${descriptor} ${place}`,
            geometry: geoData.body.features[0].geometry,
            description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo sed corporis in laudantium mollitia quisquam cum libero perspiciatis? Repudiandae ducimus maxime, culpa corrupti quam animi praesentium error vel perspiciatis laboriosam!`,
            images: [
                {
                    url: 'https://res.cloudinary.com/abomination/image/upload/v1625360716/YelpCamp/lleoravknwnfvzchuwz8.jpg',
                    filename: 'YelpCamp/lleoravknwnfvzchuwz8'
                },
                {
                    url: 'https://res.cloudinary.com/abomination/image/upload/v1625360719/YelpCamp/dpi31h7hahfg2scgscgg.jpg',
                    filename: 'YelpCamp/dpi31h7hahfg2scgscgg'
                }
            ]


        })
        await camp.save();
        console.log(camp);
    }
}

seedDB();