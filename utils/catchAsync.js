module.exports = func => {
    // returning a function that accepts a function and then executes that function
    return (req, res, next) => {
        func(req, res, next).catch(next)  // catches errors and passes to next, if there's an error
    }
}