const mongoose = require('mongoose');
const Divesite = require('../models/divesite');

mongoose.connect('mongodb://localhost:27017/yelp-dive', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


seedDB().then(() => {
    mongoose.connection.close();
})