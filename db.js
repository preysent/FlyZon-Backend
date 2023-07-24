// getting-started.js
const mongoose = require('mongoose');
require('dotenv').config() // use to excess envirement variable


// connection string for database
// const mongoURI= "mongodb://127.0.0.1:27017/flyzon"
const mongoURI = process.env.DB_CONNECTION_STRING


// function to connect database
const connectToMongoose = async() =>{
    await mongoose.connect(mongoURI);
    console.log("connected to mongo successfully")
}

module.exports = connectToMongoose;