const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose.connect("mongodb://localhost:27017/book-store")
    .then(() => console.log("DB is Connected !!!"))
    .catch((err) => console.log(err));
};

module.exports = dbConnection();
