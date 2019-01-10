var express = require("express");
var app=express();
var test = "test";
var Store = require("./models/store")
var bodyParser = require("body-parser");
var seedDB = require("./seeds")
var Comment = require("./models/comment");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
app.use(bodyParser.urlencoded({extended:true}));

var commentRoutes = require("./routes/comments");
var storeRoutes = require("./routes/stores");
var indexRoutes = require("./routes/index");
var authRoutes= require("./routes/index");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");


//schema
seedDB();



//passport
app.use(require("express-session")({
    secret: "hello",
    resave:false,
    saveUninitialized: false
    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();

}   );
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.get("/", function(req,res){
    res.render("landing");
});

app.use(indexRoutes);
app.use(storeRoutes);

app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("started");
});