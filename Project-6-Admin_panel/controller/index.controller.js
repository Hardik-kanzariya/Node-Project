const { sendMail } = require("../config/mailConfig");
 const Admin = require("../model/admin.model")
 
 exports.logout = async (req, res) => {
     res.clearCookie("admin");
     return res.redirect("/")
 }
 exports.loginPage = async (req, res) => {
    if(req.cookies && req.cookies.admin && req.cookies.admin._id){
        return res.redirect("/dashboard")
    }else{
        return res.render('login')
    }
}
exports.dashBoard = async (req, res) => {
    if(req.cookies == null || req.cookies.admin == undefined || req.cookies.admin._id == undefined){
        return res.redirect("/");
    }else{
        let admin = await Admin.findById(req.cookies.admin._id)
        return res.render('dashboard', {admin})
    }
}
 
 
 exports.loginAdmin = async (req, res) => {
    try {
        // console.log(req.body);
        let admin = await Admin.findOne({email: req.body.email})
        // console.log(admin);
        if(admin){
            if(admin.password == req.body.password){
                res.cookie("admin", admin)
                return res.redirect("/dashboard")
            }else{
                console.log("Password is not matched");
                return res.redirect("back");
            }
        }else{
            console.log("Admin not Found");
            return res.redirect("back");
        }
    } catch (error) {
        return res.redirect("back");
    }
}
 
 
 exports.forgotPasswordPage = (req, res) => {
     try {
         return res.render('forgotPassword/forgotpassword');
     } catch (error) {
         console.log(error);
         return res.redirect("back");
     }
 }
 
 exports.sendEmail = async(req, res) => {
     try {
         // console.log(req.body);
         let admin = await Admin.findOne({email: req.body.email});
         if(admin){
             let otp = Math.floor(Math.random() * 1000000);
             await sendMail(req.body.email, otp);
             res.cookie("email", req.body.email);
             res.cookie("otp", otp);
             return res.render("forgotPassword/otp");
         }else{
             console.log("Admin not found!!!!!");
             return res.redirect("back");
         }
         
     } catch (error) {
         console.log(error);
         return res.redirect("back");
     }
 }

 
 exports.verifyOTP = async (req, res) => {
     try {
         console.log(req.body);
         console.log(req.cookies.otp)
         let otp = req.cookies.otp;
 
         if(otp == +req.body.otp){
             return res.render('forgotPassword/newPassword')
         }else{
             console.log("OTP Mismatched....");
             return res.redirect("back");
         }
     } catch (error) {
         console.log(error);
         return res.redirect("back");
     }
 };
 
 
 exports.changePassword = async (req, res) => {
     try {
         // console.log(req.body);
         let password = req.body.password;
         let cPass = req.body.c_password;
         let email = req.cookies.email;
 
         if(password == cPass){
             let admin = await Admin.findOne({email: email});
             if(admin){
                 await Admin.findOneAndUpdate({email: email}, req.body, {new: true});
                 console.log("password Update");
                 res.clearCookie("email");
                 res.clearCookie("otp");
                 return res.redirect("/")
             }else{
                 console.log("Admin not found");
                 return res.redirect("/");
             }
         }else{
             console.log("Password & Confirm password is not matched....");
             return res.redirect("back");
         }
     } catch (error) {
         console.log(error);
         return res.redirect("back");
     }
 }


 exports.profile = async (req, res) => {
    try {
        if (req.cookies == null || req.cookies.admin == undefined || req.cookies.admin._id == undefined) {
            return res.redirect("/profile");
        }
        let admin = await Admin.findById(req.cookies.admin._id);
        return res.render("profile", { admin });
    } catch (error) {
        console.log(error);
        return res.redirect("/profile");
    }
};
