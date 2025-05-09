
const mongoose = require("mongoose");

const dbconnect = () => {
    mongoose.connect("mongodb+srv://hardikkanzariya620:hardik123@cluster0.ij995.mongodb.net/API")
    .then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));
};

module.exports = dbconnect();