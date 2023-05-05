const express = require('express')
const router = express.Router()

router.get('/what-is', (req, res) => {
    res.render('navbar/about/whatIs')
})

router.get('/who-is-behind', (req, res) => {
    res.render('navbar/about/whoIsBehind')
})

router.get('/who-is-it-for', (req, res) => {
    res.render('navbar/about/whoIsItFor')
})

// Path to view our other tools
router.get('/astrsc', (req, res) => {
    res.render('navbar/our-tools/astrsc')
})

router.get('/contact-us', (req, res) => {
    res.render('navbar/contact')
})

module.exports = router;