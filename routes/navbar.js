const express = require('express')
const router = express.Router()

router.get('/who-is-behind', (req, res) => {
    res.render('navbar/about/whoIsBehind')
})

// Path to view our other tools
router.get('/astrsc', (req, res) => {
    res.render('navbar/astrsc')
})

router.get('/contact-us', (req, res) => {
    res.render('navbar/contact')
})

module.exports = router;