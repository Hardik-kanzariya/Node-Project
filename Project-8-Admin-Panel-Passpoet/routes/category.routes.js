const express = require('express');
const categoryRoutes = express.Router();
const { addCategoryPage , viewCategory ,addCategory,deleteCategory ,editCategoryPage,updateCategory } = require('../controller/category.controller');    
const Category = require("../models/category.model");


// Route to Add page
categoryRoutes.get("/add-category", addCategoryPage);
categoryRoutes.post("/add-category", Category.uploadImage, addCategory);
categoryRoutes.get("/view-category", viewCategory);
categoryRoutes.post("/update-category/:id", Category.uploadImage, updateCategory);
categoryRoutes.get("/edit-category/:id", editCategoryPage);
categoryRoutes.get("/delete-category/:id",  deleteCategory);

module.exports = categoryRoutes;