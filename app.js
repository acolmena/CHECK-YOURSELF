if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const uri = process.env.DB_URL;
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const converter = require('json-2-csv');

// require routes 
const frames = require('./routes/frames')
const navbar = require('./routes/navbar')

// 'mongodb://127.0.0.1:27017/scanner-maker
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
// async function run() {
// try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
// }
// }
// run().catch(console.dir);

const app = express();

app.engine('ejs', ejsMate);  // for boilerplate 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))   // double underscore

app.use(express.urlencoded({extended: true})) // important to parse req.body
app.use(methodOverride('_method')) 

// Use routes from "routes" directory
app.use('/frames', frames);
app.use('/', navbar);
app.use(express.static(path.join(__dirname, 'public')));  // serving public directory
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = ["https://fonts.gstatic.com/",];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// app.use(converter())
// app.use(json2csvCallback())

// get request for home page
app.get('/', (req, res) => {
    res.render('home')
})

// app.post('/clear-database', async (req, res) => {
//     try {
//       // Clear the database collection associated with YourModel
//       await Frame.deleteMany({});
//       res.sendStatus(204); // No Content
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
// });


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