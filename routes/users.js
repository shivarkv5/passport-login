const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const passport = require("passport");

//Importing user model
const User = require("../models/user")



router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;

    var errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill all fields" });
    }

    if (password !== password2) {
        errors.push({ msg: "PLease enter matching passwords" })
    }

    if (password.length < 8) {
        errors.push({ msg: "password must be atleast 8 characters" })
    }

    // If there are any errors it redirects to register page.
    // Also it sends errors, name, email, password to the register ejs.
    if (errors.length > 0) {
        //If validation fails displays register page with list of errors
        res.render('register', {
            errors, name, email, password, password2
        });
        console.log(errors)
    } else {
        // Validation passed 
        User.findOne({ email: email })
            .then(user => {

                if (user) {
                    // If user exists already
                    errors.push({ msg: "Email is already registered" })

                    res.render('register', {
                        errors, name, email, password, password2
                    });
                    console.log(errors)
                } else {
                    // If no user exists
                    const newUser = new User({ name, email, password });

                    console.log(newUser)

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Hashing password
                            newUser.password = hash;
                            // Saving user to db
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg","You are now registered! ")
                                    res.redirect("/users/login")
                                })
                                .catch(user => console.log(err));
                        })
                    })

                }
            })

    }
}

)

//Login Handle
router.post('/login', (req,res, next)=>{
    //It calls local strategy and function
    passport.authenticate('local', {
        successRedirect:"/dashboard",
        failureRedirect:"/users/login",
        failureFlash:true
    })(req,res,next);
})

//Logout Handle 
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success_msg","You're logged out");
    res.redirect("/users/login")
})

module.exports = router;

