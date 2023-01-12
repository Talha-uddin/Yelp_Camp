const mongoose = require('mongoose');
const { Schema } = mongoose;
const Campground = require('../models/campground')

const wishlistSchema = new Schema({
    groundId: String,
    title: String,
    images: String,
    price: Number,
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Wishlist', wishlistSchema);