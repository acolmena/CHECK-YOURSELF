if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Frame = require('./models/frame')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


// require routes 
const frames = require('./routes/frames')
const navbar = require('./routes/navbar')

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

// Use routes from "routes" directory
app.use('/frames', frames);
app.use('/', navbar);
app.use(express.static(path.join(__dirname, 'public')))  // serving public directory
app.use(mongoSanitize())
app.use(helmet())

// get request for home page
app.get('/', (req, res) => {
    res.render('home')
})

app.post('/clear-database', async (req, res) => {
    try {
      // Clear the database collection associated with YourModel
      await Frame.deleteMany({});
      res.sendStatus(204); // No Content
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


// app.get('/makeframe', catchAsync(async (req, res) => {
//     const frame = new Frame({
//         title: 'Generalization', 
//         description: "Africa is often treated as a country, and Africans depicted as a monolith! If it’s relevant, try to be more specific.",
//         words: ['africa', 'continent']
//     });
//     await frame.save();
//     res.send(frame)
// }))



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