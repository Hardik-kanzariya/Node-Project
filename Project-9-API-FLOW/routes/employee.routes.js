const express = require('express');
const routes = express.Router();
const uploadImage = require("../middleware/uploadImage");
const { verifyEmployeeToken } = require('../middleware/verifyToken');
const {  activateEmployee, employeeForgotPassword, employeeResetPassword, deleteEmployee, viewAllEmployee, changePasswordEmployee, loginEmployee, myProfile, updateEmployeeProfile } = require('../controller/employee.controller');

// Employee Routes 
routes.post("/login", loginEmployee);   

routes.get("/profile", verifyEmployeeToken, myProfile); 

routes.post("/change-password", verifyEmployeeToken, changePasswordEmployee);

routes.get("/view-all-employee", verifyEmployeeToken, viewAllEmployee)
routes.delete("/delete-employee/:id", verifyEmployeeToken, deleteEmployee)
routes.put("/activate-employee/:id", verifyEmployeeToken, activateEmployee);
routes.post("/forgot-password", employeeForgotPassword);
routes.post("/reset-password/:id", employeeResetPassword);
routes.put("/update-profile", verifyEmployeeToken, uploadImage.single('profileImage'), updateEmployeeProfile);

module.exports = routes;