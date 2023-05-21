const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {validateFrame} = require('../middleware')
const frames = require('../controllers/frames')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

// Create & show routes
router.route('/')
    .get(catchAsync(frames.index))
    .post(validateFrame, catchAsync(frames.createFrame))
    // .post(upload.single('reloadedFrames'), importData, (req, res) => {
    //     console.log(req.body, req.file)
    //     res.send(document.querySelector('#reloadFramesForm'))
    // })

// Scan route
router.route('/scan')
    .get(catchAsync(frames.renderScan))

// Render create route
// NOTE: order matters, this needs to be before the /frames/:id route below
// router.get('/new', (req, res) => {
//     res.render('frames/new');
// })

// Show route
// router.get('/:id', catchAsync(async (req, res) => {
//     const frame = await Frame.findById(req.params.id)
//     res.render('frames/show', {frame})
// }))

// Edit routes
router.route('/:id')
    .put(validateFrame, catchAsync(frames.updateFrame))
    // Delete route
    .delete(catchAsync(frames.deleteFrame))

router.route('/:id/edit')
    .get(catchAsync(frames.renderEdit))


module.exports = router; 