
const express = require('express');
const { registerAdmin, loginAdmin, myProfile, changePassword, addManager, viewAllManager, deleteManager, activateManager, adminForgotPassword, adminResetPassword, deleteAdmin, activateAdmin, viewAllEmployee, deleteEmployee, activateEmployee, updateAdminProfile } = require('../controller/admin.controller');
const routes = express.Router();
const uploadImage = require("../middleware/uploadImage");
const { verifyAdminToken } = require('../middleware/verifyToken');

routes.post("/register", uploadImage.single('profileImage'), registerAdmin);

routes.post("/login", loginAdmin);   

routes.get("/profile", verifyAdminToken, myProfile); 

routes.post("/change-password", verifyAdminToken, changePassword);

routes.delete("/delete-admin/:id", verifyAdminToken, deleteAdmin)

routes.put("/activate-admin/:id", verifyAdminToken, activateAdmin);

routes.post("/reset-password/:id", adminResetPassword);

routes.post("/forgot-password", adminForgotPassword);

routes.put("/update-profile", verifyAdminToken, uploadImage.single('profileImage'), updateAdminProfile);

// Manager Routes
routes.post("/add-manager", verifyAdminToken, uploadImage.single('profileImage'), addManager)

routes.get("/view-all-manager", verifyAdminToken, viewAllManager)

routes.delete("/delete-manager/:id", verifyAdminToken, deleteManager)

routes.put("/activate-manager/:id", verifyAdminToken, activateManager);

// Employee Routes

routes.get("/view-all-employee", verifyAdminToken, viewAllEmployee);

routes.delete("/delete-employee/:id", verifyAdminToken, deleteEmployee);

routes.put("/activate-employee/:id", verifyAdminToken, activateEmployee);


module.exports = routes;
