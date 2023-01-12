const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const Wishlist = require('../models/wishlist');
const { isLoggedIn, isWishlistAuthor } = require('../middleware');




router.post('/campgrounds/:id/wishlist', isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const wishlist = new Wishlist(req.body.wishlist);
    wishlist.author = req.user._id;
    campground.wishlist.push(wishlist);
    await wishlist.save();
    await campground.save();
    req.flash('success', 'Added To Wishlist!')
    res.redirect('/wishlist');
}))

router.get('/wishlist', isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.find({})
    const wishlist = await Wishlist.find({});
    wishlist.author = req.user._id;
    res.render('wishlist/index', { wishlist, campground });
}))

router.delete('/wishlist/:wishlistId', isLoggedIn, isWishlistAuthor, catchAsync(async(req, res) => {
    const { id, wishlistId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { wishlist: wishlistId } })
    await Wishlist.findByIdAndDelete(wishlistId);
    req.flash('success', 'Successfully deleted ground')
    res.redirect('/wishlist');
}))

module.exports = router;