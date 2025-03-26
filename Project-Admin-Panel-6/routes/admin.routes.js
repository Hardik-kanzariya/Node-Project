const express = require("express");
const adminRoutes = express.Router();
const Admin = require("../model/admin.model");
const { 
    addAdminPage, viewAdminPage, addNewAdmin, 
    editAdminPage, updateAdmin, deleteAdmin
} = require("../controller/admin.controller");

adminRoutes.get("/add-admin", addAdminPage);
adminRoutes.get("/view-admin", viewAdminPage);
adminRoutes.post("/add-admin", Admin.uploadImage, addNewAdmin);
adminRoutes.get("/edit-admin/:id", editAdminPage);
adminRoutes.delete("/delete-admin/:id", deleteAdmin);
adminRoutes.post("/update-admin/:id", Admin.uploadImage, updateAdmin);

module.exports = adminRoutes;
