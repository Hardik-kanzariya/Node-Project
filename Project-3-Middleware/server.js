const express = require("express");
const port = 9009;
const path = require("path");

const server = express();
server.use(express.urlencoded());
server.set("view engine","ejs");

server.use("/",express.static(path.join(__dirname,"public")));


server.get("/",(req,res)=>{
    res.render("index");
});
server.get("/components",(req,res)=>{
    res.render("components");
});
server.get("/forms",(req,res)=>{
    res.render("forms");
});
server.get("/tables",(req,res)=>{
    res.render("tables");
});
server.get("/notifications",(req,res)=>{
    res.render("notifications");
});
server.get("/icons",(req,res)=>{
    res.render("icons");
});
server.get("/typography",(req,res)=>{
    res.render("typography");
});

server.listen(port,()=>{
    console.log(`Server start at http://localhost:${port}`);  
});
