const LocalStrategy = require("passport-local").Strategy;
// Using mongoose to check email and password
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user = require("../models/user");

//expoting the strategy we've created   

module.exports = (passport)=>{
    passport.use(new LocalStrategy({usernameField:"email"},(email,password,done)=>{
        // Check if email is present or Match User
        user.findOne({email:email})
        // If its found it gives us the user details 
        .then(user=>{
            // If no match found
            if(!user){
                // null for error, false for user, options = msg
                return done(null, false,  {message:"User not found"} )
            }

            //Match Found
            //Here user.password = hashed password , it comes from database and password = plain text password
        
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;

                if(isMatch ){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message:"Password Incorrect"})
                }

            })
        })
        .catch()
    }))


    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
