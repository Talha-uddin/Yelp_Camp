const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const Wishlist = require('./models/wishlist')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in!')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const mgs = error.details.map(el => el.message).join(',')
        throw new ExpressError(mgs, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isWishlistAuthor = async(req, res, next) => {
    const { id, wishlistId } = req.params;
    const wishlist = await Wishlist.findById(wishlistId)
    if (!wishlist.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const mgs = error.details.map(el => el.message).join(',')
        throw new ExpressError(mgs, 400)
    } else {
        next();
    }
}