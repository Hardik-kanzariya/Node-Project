const express = require('express');
const routes = express.Router();
const uploadImage = require("../middleware/uploadImage");
const { verifyManagerToken } = require('../middleware/verifyToken');
const { loginManager, myProfile,registerManager, changePasswordManager, viewAllManager, deleteManager, activateManager, managerForgotPassword, managerResetPassword, addEmployee, viewAllEmployee, activateEmployee, deleteEmployee, updateManagerProfile } = require('../controller/manager.controller');

// Manager Routes
routes.post("/register", uploadImage.single('profileImage'), registerManager); 
routes.post("/login", loginManager);   

routes.get("/profile", verifyManagerToken, myProfile); 

routes.post("/change-password", verifyManagerToken, changePasswordManager);

routes.get("/view-all-manager", verifyManagerToken, viewAllManager)
routes.delete("/delete-manager/:id", verifyManagerToken, deleteManager)
routes.put("/activate-manager/:id", verifyManagerToken, activateManager);
routes.post("/forgot-password", managerForgotPassword);
routes.post("/reset-password/:id", managerResetPassword);
routes.put("/update-profile", verifyManagerToken, uploadImage.single('profileImage'), updateManagerProfile);

// Employee Routes
routes.post("/add-employee", verifyManagerToken, uploadImage.single('profileImage'), addEmployee);
routes.get("/view-all-employee", verifyManagerToken, viewAllEmployee)
routes.delete("/delete-employee/:id", verifyManagerToken, deleteEmployee)
routes.put("/activate-employee/:id", verifyManagerToken, activateEmployee);


module.exports = routes;