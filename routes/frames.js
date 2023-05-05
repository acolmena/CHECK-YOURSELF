const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Frame = require('../models/frame')
const {frameSchema} = require('../schemas.js')

// Middleware function for validating frames required fields are filled out
const validateFrame = (req, res, next) => {
    // converting input string to array before validating and entering into dbs
    const {words} = req.body.frame;
    console.log(req.body.frame)
    if (words.includes(',')) {
        // const re = /\s*(?:,|$)\s*/;
        req.body.frame.words = words.split(',')
        req.body.frame.words = req.body.frame.words.map((wrd) => wrd.trim())

    }
    console.log(req.body.frame)
    const { error } = frameSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')  // map over error.details to make a single string message
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    const count = await Frame.find().estimatedDocumentCount();
    res.render('frames/index', {frames, count})
}))

router.get('/scan', catchAsync(async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    res.render('frames/scan', {frames})
}))

// Create routes
// NOTE: order matters, this needs to be before the /frames/:id route below
router.get('/new', (req, res) => {
    res.render('frames/new');
})

router.post('/', validateFrame, catchAsync(async (req, res, next) => {
    const newFrame = new Frame(req.body.frame); 
    await newFrame.save()
    // res.send(newFrame.description)
    res.redirect(`/frames`)
}))

// Show route
router.get('/:id', catchAsync(async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    res.render('frames/show', {frame})
}))

// Edit routes
router.get('/:id/edit', catchAsync(async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    const frames = await Frame.find({})  // find all items in dbs
    const count = await Frame.find().estimatedDocumentCount();
    res.render('frames/edit', {frame, frames, count})
}))

router.put('/:id', validateFrame, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Frame.findByIdAndUpdate(id, {...req.body.frame});
    res.redirect(`/frames`);
}))

// Delete route
router.delete('/:id', catchAsync(async (req, res) => {
    await Frame.findByIdAndDelete(req.params.id)
    res.redirect('/frames')
}))

module.exports = router; 