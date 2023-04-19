const mongoose = require('mongoose')
const {ASTRSCArrays} = require('./frameSeeds')  // need to destructure 
const Frame = require('../models/frame')
 

mongoose.connect('mongodb://127.0.0.1:27017/scanner-maker')  // note: use the number URL rather than the localhost url
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("Connection Error:")
    console.log(err)
})

const arrLength = ASTRSCArrays.length;

const randomWrd = (arr, length) => {
    return arr[Math.floor((Math.random() * length))];
}

const seedDB = async () => {
    await Frame.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const frame = new Frame({
            title: `${randomWrd(ASTRSCArrays, arrLength)}`,
            description: `${randomWrd(ASTRSCArrays, arrLength)} ${randomWrd(ASTRSCArrays, arrLength)} ${randomWrd(ASTRSCArrays, arrLength)} ${randomWrd(ASTRSCArrays, arrLength)} ${randomWrd(ASTRSCArrays, arrLength)} ${randomWrd(ASTRSCArrays, arrLength)}`,
            words: [`${randomWrd(ASTRSCArrays, arrLength)}`, `${randomWrd(ASTRSCArrays, arrLength)}`, `${randomWrd(ASTRSCArrays, arrLength)}`]
        })
        await frame.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
