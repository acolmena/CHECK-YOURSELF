const ExpressError = require('./utils/ExpressError')
const {frameSchema} = require('./schemas')

// Middleware function for validating frames required fields are filled out
module.exports.validateFrame = (req, res, next) => {
    if (req.body.reloadedFrames) {  // don't validate reloaded frames
        next();
        return;
    }
    // converting input string to array before validating and entering into dbs
    let {words} = req.body.frame;
    words = words.trim();
    if (words) {   // check if user only entered spaces
        if (words.includes(',')) {
            // const re = /\s*(?:,|$)\s*/;
            let finalWrds = []
            words.split(',').forEach((wrd) => {
                wrd = wrd.trim()  // remove whitespace from words
                if (wrd) {   // prevents adding empty strings to array
                    finalWrds.push(wrd)
                }
            })
            req.body.frame.words = finalWrds
         } else {
            req.body.frame.words = [words]
        }
    }
    
    // start of validation
    const { error } = frameSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')  // map over error.details to make a single string message
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
