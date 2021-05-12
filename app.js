const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash")
const session = require("express-session")
const passport =  require("passport");

const routes = require("./routes/index");
const users = require("./routes/users");
//const passport = require("./config/passport");

const app = express();

//Passport COnfig
require('./config/passport')(passport);



//MongoDB Configuration 
const db = require('./config/keys').MongoURI;

//Connect to MONGO
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB Connected...")).catch((err) => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Set an express session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize()); // This initialize local strategy
app.use(passport.session());

//Middleware to connect flash 
app.use(flash());

//Global variables
// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });





//Calling Routes
app.use("/", routes);
app.use("/users", users);

const port = process.env.port || 3000

app.listen(port, () => { console.log(`Server started on port ${port}`) });