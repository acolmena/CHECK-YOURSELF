const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Frame = require('./models/frame')
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1:27017/scanner-maker')  // note: use the number URL rather than the localhost url
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("Connection Error:")
    console.log(err)
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))   // double underscore

app.use(express.urlencoded({extended: true})) // important to parse req.body
app.use(methodOverride('_method')) 

// get request for home page
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makeframe', async (req, res) => {
    const frame = new Frame({
        title: 'Generalization', 
        description: "Africa is often treated as a country, and Africans depicted as a monolith! If it’s relevant, try to be more specific.",
        words: ['africa', 'continent']
    });
    await frame.save();
    res.send(frame)
})

app.get('/frames', async (req, res) => {
    const frames = await Frame.find({})  // find all items in dbs
    res.render('frames/index', {frames})
})

// NOTE: order matters, this needs to be before the /frames/:id route below
app.get('/frames/new', (req, res) => {
    res.render('frames/new');
})

app.post('/frames', async (req, res) => {
    const newFrame = new Frame(req.body.frame); 
    await newFrame.save()
    // res.send(newFrame.description)
    res.redirect(`/frames/${newFrame._id}`)
})

app.get('/frames/:id/edit', async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    res.render('frames/edit', {frame})
})

app.get('/frames/:id', async (req, res) => {
    const frame = await Frame.findById(req.params.id)
    res.render('frames/show', {frame})
})

app.put('/frames/:id', async (req, res) => {
    const {id} = req.params;
    await Frame.findByIdAndUpdate(id, {...req.body.frame});
    res.redirect(`/frames/${id}`);
})

app.delete('/frames/:id', async (req, res) => {
    await Frame.findByIdAndDelete(req.params.id)
    res.redirect('/frames')
})



// setup port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})