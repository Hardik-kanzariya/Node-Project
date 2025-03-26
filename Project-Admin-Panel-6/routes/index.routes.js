const express = require("express");
const router = express.Router();

const { 
    dashboard, loginPage, loginAdmin, logout
} = require("../controller/index.controller");

router.get("/", loginPage);
router.get("/dashboard", dashboard);
router.post("/login", loginAdmin);
router.get("/logout", logout);

router.use("/admin", require("./admin.routes"));

module.exports = router;
