const ExpressError = require('./utils/ExpressError')
const {frameSchema} = require('./schemas')

// Middleware function for validating frames required fields are filled out
module.exports.validateFrame = (req, res, next) => {
    console.log(req.body)
    // converting input string to array before validating and entering into dbs
    let {words} = req.body.frame;
    if (words.trim()) {
        if (words.includes(',')) {
            // const re = /\s*(?:,|$)\s*/;
            req.body.frame.words = words.split(',').map((wrd) => wrd.trim())
    
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
