const nodemailer = require("nodemailer");

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

exports.sendMail = async function (receiverEmail, password) {
  try {
    const info = await transporter.sendMail({
      from:  'hardikkanzariya620@gmail.com', 
      to: `${receiverEmail}`,
      subject: "Reset Password ✔",
      text: `Your reset password Password is: ${password}`,
      html: `<h3>Hello,</h3>
             <p>Your reset password is: <strong>${password}</strong></p>
             <p>This password  is valid for 5 minutes.</p>
             <p>If you didn't request this, ignore this email.</p>`,
    });

    console.log("Password email sent successfully to:", receiverEmail);
  } catch (error) {
    console.error("Error sending Password email:", error);
  }
};
