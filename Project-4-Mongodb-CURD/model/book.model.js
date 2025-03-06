const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    country: {
        type: String,
    },
    language: {
        type: String,
    },
    genre: {
       type: String,  
    },
    price: {
        type:  Number,
    },
    publishedYear: {
        type:  Number,
    },
});

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;
