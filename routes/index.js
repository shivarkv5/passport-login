const express = require("express");
const router = express.Router();
const { ensureAuth } =  require("../config/auth");


//Welcome page
router.get("/", (req, res) => {
    res.render("welcome");
})

//Dashboard
router.get("/dashboard", ensureAuth , (req,res)=>{
    const userName = req.user.name;
    res.render("dashboard" ,{name:userName})
})






module.exports = router;