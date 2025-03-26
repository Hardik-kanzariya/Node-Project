const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your SMTP server
    port: 587, // Common port for SMTP
    secure: false, // Use true for 465, false for other ports
    auth: {
        user: 'hardikkanzariya620@gamil.com', // Replace with your email
        pass: 'uvaxxxlmdvvmrekv' // Replace with your email password
    }
});

// Function to send mail
const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: 'hardikkanzariya620@gamil.com', // Replace with your name and email
            to: `${reciverEmail}`,
            subject: subject,
            text: text
        });
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Example usage
sendMail('recipient@example.com', 'Test Subject', 'This is a test email.');


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'hardikkanzariya620@gamil.com',
    pass: 'uvaxxxlmdvvmrekv'
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from:'hardikkanzariya620@gamil.com',  // sender address
    to: 'hardikkanzariya620@gamil.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<h2>Hello world?</h2>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
