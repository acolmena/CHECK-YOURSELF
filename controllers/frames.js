const Frame = require('../models/frame')

module.exports.index = async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    const count = await Frame.find().estimatedDocumentCount();
    // module.exports.frames = frames;
    res.render('frames/index', {frames, count})
}

module.exports.createFrame = async (req, res, next) => {
    let reloadedFrames = req.body.reloadedFrames;
    if (reloadedFrames) {
        await Frame.insertMany(JSON.parse(reloadedFrames))
    } else {
        const newFrame = new Frame(req.body.frame); 
        await newFrame.save()
    }
    res.redirect(`/frames`)
}

module.exports.renderScan = async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    res.render('frames/scan', {frames})
}

module.exports.updateFrame = async (req, res) => {
    const {id} = req.params;
    await Frame.findByIdAndUpdate(id, {...req.body.frame});
    res.redirect(`/frames`);
}

module.exports.deleteFrame = async (req, res) => {
    await Frame.findByIdAndDelete(req.params.id)
    res.redirect('/frames')
}

module.exports.renderEdit = async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    const frames = await Frame.find({})  // find all items in dbs
    const count = await Frame.find().estimatedDocumentCount();
    res.render('frames/edit', {frame, frames, count})
}