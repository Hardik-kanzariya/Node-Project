
const Manager = require("../models/manager.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Employee = require("../models/employee.model");
const { sendMail } = require("../config/sendMali");


// Register Manager
exports.registerManager = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;
    let imagePath = "";
    let manager = await Manager.findOne({ email: email, isDelete: false });
    if (manager) {
      return res.status(400).json({ message: "Manager Already Exist" });
    }

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    let hashPassword = await bcrypt.hash(password, 10);
    manager = await Manager.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
      gender,
      profileImage: imagePath,
    });

    return res.status(201).json({ message: "Manager Register Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Manager
exports.loginManager = async (req, res) => {
     try {
    const { email, password } = req.body;
    let manager = await Manager.findOne({ email: email, isDelete: false });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    let matchPass = await bcrypt.compare(password, manager.password);
    if (!matchPass) {
      return res.status(400).json({ message: "Password is not matched" });
    }
    let payload = {
      managerId: manager._id,
    };
    let token = await jwt.sign(payload, "manager");
    return res
      .status(200)
      .json({ message: "Manager Login Success", managerToken: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manager Profile
exports.myProfile = async (req, res) => {
  try {
    let manager = req.user;
    return res.status(200).json({ message: "Profile Success", data: manager });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manager Change-password
exports.changePasswordManager = async (req, res) => {
  try {
    const { current_pass, new_pass, confirm_pass } = req.body;
    let manager = req.user;
    let matchPass = await bcrypt.compare(current_pass, manager.password);
    if (!matchPass) {
      return res
      .status(400)
      .json({ message: "Current password is not matched" });
    }
    if (current_pass == new_pass) {
      return res
        .status(400)
        .json({ message: "Current password and New password is matched" });
    }
    if (new_pass != confirm_pass) {
      return res
        .status(400)
        .json({ message: "New password and Confirm password is not matched" });
    }

    let hashPassword = await bcrypt.hash(new_pass, 10);
    manager = await Manager.findByIdAndUpdate(
      manager._id,
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password Change Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    let { firstname, lastname, email, password, gender, profileImage} = req.body;
    let employee = await Employee.findOne({email: email, isDelete: false});

    if(employee){
      return res.status(400).json({message: "Employee already exist"});
    }

    if(req.file){
      profileImage = `/uploads/${req.file.filename}`;
    }
    let hashPassword = await bcrypt.hash(password, 10);

    employee = await Employee.create({
      firstname, lastname, email, gender, password: hashPassword, profileImage
    })
    await sendMail(email, password);
    return res.status(201).json({message: "New Employee Added Success"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.viewAllManager = async (req, res) => {
  try {
    let managers = await Manager.find();
    return res.status(200).json({message: "All Manager Fetch Success", data: managers})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
exports.viewAllEmployee = async (req, res) => {
  try {
    let employees = await Employee.find();
    return res.status(200).json({message: "All Employee Fetch Success", data: employees})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete Manager
exports.deleteManager = async (req, res) => {
  try {
    let id = req.params.id;
    let manager = await Manager.findOne({_id: id, isDelete: false});
    if(!manager){
      return res.status(404).json({message: "Manager Not Found"})
    }
    manager = await Manager.findByIdAndUpdate(id, {isDelete: true}, {new: true})
    return res.status(200).json({message: "Delete Success"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Manager
exports.activateManager = async (req, res) => {
  try {
    let id = req.params.id;
    // let manager = await Manager.findOne({ _id: id, isDelete: true });
    // if (!manager) {
    //   return res.status(404).json({ message: "Manager Not Found || Manager already Activated" });
    // }
    let manager = await Manager.findById(id);
    if(!manager){
      return res.status(404).json({ message: "Manager Not Found" });
    }
    if(manager.isDelete == false){
      return res.status(404).json({ message: "Manager already Activated" });
    }
    manager = await Manager.findByIdAndUpdate(
      id,
      { isDelete: false },
      { new: true }
    );
    return res.status(200).json({ message: "Manager is Activated Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Active Employee
exports.activateEmployee = async (req, res) => {
  try {
    let id = req.params.id;
    // let employee = await Employee.findOne({ _id: id, isDelete: true });
    // if (!employee) {
    //   return res.status(404).json({ message: "Employee Not Found || Employee already Activated" });
    // }
    let employee = await Employee.findById(id);
    if(!employee){
      return res.status(404).json({ message: "Employee Not Found" });
    }
    if(employee.isDelete == false){
      return res.status(404).json({ message: "Employee already Activated" });
    }
    employee = await Employee.findByIdAndUpdate(
      id,
      { isDelete: false },
      { new: true }
    );
    return res.status(200).json({ message: "Employee is Activated Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    let id = req.params.id;
    let employee = await Employee.findOne({_id: id, isDelete: false});
    if(!employee){
      return res.status(404).json({message: "Employee Not Found"})
    }
    employee = await Employee.findByIdAndUpdate(id, {isDelete: true}, {new: true})
    return res.status(200).json({message: "Employee is Delete Success"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: 'hardikkanzariya620@gmail.com',
    pass: 'uvaxxxlmdvvmrekv', 
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Manager Forgot Password

exports.managerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(404).json({ message: "Manager not found" });

     // Generate a 5-digit numeric password
     const newPassword = Math.floor(10000 + Math.random() * 90000).toString();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    manager.password = hashedPassword;

    // Send email with new password
    await transporter.sendMail({
      to: email,
      subject: "Manager Password Reset",
      html: `<p>Your new password is: <strong>${newPassword}</strong></p>`,
    });

    res.status(200).json({ message: "New password sent to Manager's email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Manager Reset Password
exports.managerResetPassword = async (req, res) => {
  try {
    const { managerId } = req.params;
    const { new_pass, confirm_pass } = req.body;

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const manager = await Admin.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10);
    admin.password = hashedPassword;
    await manager.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateManagerProfile = async (req, res) => {
  try {
    const manager = req.user; // comes from verifyAdminToken middleware
    const { firstname, lastname, email, gender } = req.body;

    let updatedData = { firstname, lastname, email, gender };

    // Handle profile image if uploaded
    if (req.file) {
      updatedData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      manager._id,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Manager Profile Updated Successfully", data: updatedManager });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};