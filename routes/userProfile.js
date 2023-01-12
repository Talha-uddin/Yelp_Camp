const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const isLoggedIn = require('../middleware.js')

router.get('/users/:id', catchAsync(async(req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/userProfile', { user });
}))

router.put('/users/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {...req.body.user });
    req.flash('success', 'Successfully updated Ground!')
    res.redirect(`/users/${user._id}`)
}))

module.exports = router;