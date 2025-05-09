const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const Manager = require("../models/manager.model");
const Employee = require("../models/employee.model");

exports.verifyAdminToken = async (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { adminId } = await jwt.verify(token, "admin");
  const admin = await Admin.findById(adminId);
  if (admin) {
    req.user = admin;
    next();
  } else {
    return res.status(400).json({ message: "Invalid Admin" });
  }
};

exports.verifyManagerToken = async (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { managerId } = await jwt.verify(token, "manager");
  const manager = await Manager.findById(managerId);
  if (manager) {
    req.user = manager;
    next();
  } else {
    return res.status(400).json({ message: "Invalid Manager" });
  }
};


exports.verifyEmployeeToken = async (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { employeeId } = await jwt.verify(token, "employee");
  const employee = await Employee.findById(employeeId);
  if (employee) {
    req.user = employee;
    next();
  } else {
    return res.status(400).json({ message: "Invalid Employee" });
  }
};