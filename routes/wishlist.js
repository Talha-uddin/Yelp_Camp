const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const Wishlist = require('../models/wishlist');
const { isLoggedIn, isAuthor } = require('../middleware');




router.post('/campgrounds/:id/wishlist', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const wishlist = new Wishlist(req.body.wishlist);
    campground.wishlist.push(wishlist);
    await wishlist.save();
    await campground.save();
    res.redirect('/wishlist');
}))

router.get('/wishlist', isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.find({})
    const wishlist = await Wishlist.find({});
    res.render('wishlist/index', { wishlist, campground });
}))

router.delete('/wishlist/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Wishlist.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted ground')
    res.redirect('/wishlist');
}))

module.exports = router;