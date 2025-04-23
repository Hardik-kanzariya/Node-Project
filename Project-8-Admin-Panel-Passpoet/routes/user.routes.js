const express = require('express');
const { userPage, singleProduct,  userLoginPage,  loginUser,RegisterUserPage, registerUser,userLogout, addFavoriteProduct, getFavouriteList , removeFavoriteProduct,addCartProduct,getCartList,updateCartQuantity,removeFromCart,userProfile} = require('../controller/user.controller');
const User = require("../models/user.model");
const passport=require('passport');
const routes = express.Router();

routes.get("/", userPage);
routes.get("/user-profile", userProfile);
routes.get("/single-product/:id", singleProduct);
routes.get("/user-login",userLoginPage);
routes.post("/user-login" ,passport.authenticate('local',{failureRedirect: "/user/user-login"} ), loginUser);
routes.get("/user-register",RegisterUserPage);  
routes.post("/user-register", User.uploadImage,registerUser); 
routes.get("/user-logout",userLogout) 
routes.get("/add-favorite/:id", addFavoriteProduct);
routes.get("/favourites-list",  getFavouriteList);
routes.get("/remove-favorite/:id",removeFavoriteProduct);
routes.get("/add-cart/:id",addCartProduct);
routes.get("/cart-list",getCartList);
routes.get('/update-cart/:id', updateCartQuantity);
routes.get("/remove-from-cart/:id", removeFromCart);


module.exports = routes;