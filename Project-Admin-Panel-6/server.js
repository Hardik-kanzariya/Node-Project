const express = require('express');
const port = 9010;
const path = require('path');
const dbconnect = require("./config/dbconnection");
const app = express();
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser()); 

app.use("/", require('./routes/index.routes'));

 
app.listen(port, () => { 
    console.log(`Server started at http://localhost:${port}`);
});



