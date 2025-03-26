const Admin = require("../model/admin.model");

exports.logout = async (req, res) => {
    res.clearCookie("admin");
    return res.redirect("/");
}

exports.loginPage = async (req, res) => {
    if (req.cookies && req.cookies.admin && req.cookies.admin._id) {
        return res.redirect("/dashboard")
    } else {
        return res.render('login')
    }
}

exports.dashboard = async (req, res) => {
    if (req.cookies == null || req.cookies.admin == undefined || req.cookies.admin._id == undefined) {
        return res.redirect("/");

    } else {
        let admin = await Admin.findById(req.cookies.admin._id)
        return res.render('dashboard', { admin })
    }
}

exports.loginAdmin = async (req,res)=>{
    try {
        // console.log(req.body);
        let admin = await Admin.findOne({email: req.body.email})
        console.log(admin);
        if (admin) {
            if (admin.password == req.body.password) {
                res.cookie("admin", admin)
                return res.redirect("/dashboard")
            }else{
                console.log("Password is not matched");
                return res.redirect("back");
            }
        } else {
            console.log("Admin not Found");
            return res.redirect("back");
        }
    } catch (error) {
        return res.redirect("back");
    }
}