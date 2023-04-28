const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Frame = require('./models/frame')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {frameSchema} = require('./schemas.js')

mongoose.connect('mongodb://127.0.0.1:27017/scanner-maker')  // note: use the number URL rather than the localhost url
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("Connection Error:")
    console.log(err)
})

const app = express();

app.engine('ejs', ejsMate);  // for boilerplate 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))   // double underscore

app.use(express.urlencoded({extended: true})) // important to parse req.body
app.use(methodOverride('_method')) 

// Middleware function for 
const validateFrame = (req, res, next) => {
    const { error } = frameSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')  // map over error.details to make a single string message
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// get request for home page
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/who-is-behind', (req, res) => {
    res.render('navbar/about/whoIsBehind')
})

// Path to view our other tools
app.get('/astrsc', (req, res) => {
    res.render('navbar/astrsc')
})

app.get('/contact-us', (req, res) => {
    res.render('navbar/contact')
})

app.get('/makeframe', catchAsync(async (req, res) => {
    const frame = new Frame({
        title: 'Generalization', 
        description: "Africa is often treated as a country, and Africans depicted as a monolith! If it’s relevant, try to be more specific.",
        words: ['africa', 'continent']
    });
    await frame.save();
    res.send(frame)
}))

app.get('/frames', catchAsync(async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    res.render('frames/index', {frames})
}))

app.get('/frames/scan', (req, res) => {
    res.render('frames/scan')
})

// Create routes
// NOTE: order matters, this needs to be before the /frames/:id route below
app.get('/frames/new', (req, res) => {
    res.render('frames/new');
})

app.post('/frames', validateFrame, catchAsync(async (req, res, next) => {
    console.log(req.body)
    console.log(req.body.frame)
    const newFrame = new Frame(req.body.frame); 
    await newFrame.save()
    // res.send(newFrame.description)
    res.redirect(`/frames/${newFrame._id}`)
}))

// Show route
app.get('/frames/:id', catchAsync(async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    res.render('frames/show', {frame})
}))

// Edit routes
app.get('/frames/:id/edit', catchAsync(async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    res.render('frames/edit', {frame})
}))

app.put('/frames/:id', validateFrame, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Frame.findByIdAndUpdate(id, {...req.body.frame});
    res.redirect(`/frames/${id}`);
}))

// Delete route
app.delete('/frames/:id', catchAsync(async (req, res) => {
    await Frame.findByIdAndDelete(req.params.id)
    res.redirect('/frames')
}))

// Basic 404 error for requests to URLs we don't recognize
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const {statusCode = 500} = err; // defaults are set 
    if (!err.message) {
        message = 'Something went wrong';
    }
    res.status(statusCode).render('error', {err})
})

// setup port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})