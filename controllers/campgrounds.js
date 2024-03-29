const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })



module.exports.index = async(req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const campgrounds = await Campground.find({ title: regex })
        res.render('campgrounds/index', { campgrounds })

    } else {
        const campgrounds = await Campground.find({})
        console.log(campgrounds)
        res.render('campgrounds/index', { campgrounds });
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.showCampground = async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}


module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.deleteCampgrounds = async(req, res) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!')
    res.redirect('/campgrounds')
}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};