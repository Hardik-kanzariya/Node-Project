const Employee = require("../models/employee.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Login Employee
exports.loginEmployee = async (req, res) => {
     try {
    const { email, password } = req.body;
    let employee = await Employee.findOne({ email: email, isDelete: false });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    let matchPass = await bcrypt.compare(password, employee.password);
    if (!matchPass) {
      return res.status(400).json({ message: "Password is not matched" });
    }
    let payload = {
        employeeId: employee._id,
    };
    let token = await jwt.sign(payload, "employee");
    return res
      .status(200)
      .json({ message: "Employee Login Success", employeeToken: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Employee Profile
exports.myProfile = async (req, res) => {
  try {
    let employee = req.user;
    return res.status(200).json({ message: "Profile Success", data: employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Employee Change-password
exports.changePasswordEmployee = async (req, res) => {
  try {
    const { current_pass, new_pass, confirm_pass } = req.body;
    let employee = req.user;
    let matchPass = await bcrypt.compare(current_pass, employee.password);
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
    employee = await Employee.findByIdAndUpdate(
      employee._id, 
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password Change Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// View All Employee
exports.viewAllEmployee = async (req, res) => {
  try {
    let managers = await Manager.find();
    return res.status(200).json({message: "All Employee Fetch Success", data: employees})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    let id = req.params.id;
    let employee = await Employee.findOne({_id: id, isDelete: false});
    if(!employee){
      return res.status(404).json({message: "Employee Not Found"})
    }
    employee = await Employee.findByIdAndUpdate(id, {isDelete: true}, {new: true})
    return res.status(200).json({message: "Delete Success"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Activate Employee
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

// Employee Forgot Password
exports.employeeForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

     // Generate a 5-digit numeric password
     const newPassword = Math.floor(10000 + Math.random() * 90000).toString();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;

    // Send email with new password
    await transporter.sendMail({
      to: email,
      subject: "Employee Password Reset",
      html: `<p>Your new password is: <strong>${newPassword}</strong></p>`,
    });

    res.status(200).json({ message: "New password sent to Employee's email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Employee Reset Password
exports.employeeResetPassword = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { new_pass, confirm_pass } = req.body;

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const employee = await Admin.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10);
    admin.password = hashedPassword;
    await employee.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const employee = req.user; // comes from verifyAdminToken middleware
    const { firstname, lastname, email, gender } = req.body;

    let updatedData = { firstname, lastname, email, gender };

    // Handle profile image if uploaded
    if (req.file) {
      updatedData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Employee Profile Updated Successfully", data: updatedEmployee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};