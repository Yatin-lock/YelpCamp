const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals:true}};
const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    price: {
        type: Number,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href = "/campgrounds/${this._id}">${this.title}</a></strong>`;
});
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);