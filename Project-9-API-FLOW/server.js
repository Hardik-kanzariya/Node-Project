const express = require("express");
const port = 9000;
const dbconnect = require("./config/dbConnection");
const app = express();
const morgan = require("morgan");
const core = require("cors");

// middleware
app.use(core());
app.use(express.urlencoded());
app.use(morgan("dev"))

// route

app.use("/", require("./routes/index.routes"));

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});