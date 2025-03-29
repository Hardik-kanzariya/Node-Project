const express = require('express');
const routes = express.Router();
const {dashBoard, loginPage, loginAdmin, logout, forgotPasswordPage, sendEmail, verifyOTP, changePassword,profile} = require("../controller/index.controller");
 
 
 routes.get("/", loginPage);
 routes.get("/dashboard", dashBoard);
 
 routes.post("/login",  loginAdmin);
 routes.get("/logout", logout);
 routes.get("/profile", profile);
 
 routes.get("/forgotPassword", forgotPasswordPage);
 routes.post("/sendEmail", sendEmail);
 routes.post("/verify-otp", verifyOTP);
 routes.post("/change-password", changePassword);
 
 routes.use("/admin", require('./admin.routes'))
 routes.use("/blog", require('./blog.routes'))
 
 
 module.exports = routes;
