var express = require("express");
var router = express.Router();
var Store = require("../models/store");
router.get("/stores", function(req,res){
    Store.find({}, function(err,allstores){
        if(err){
            console.log(err);
        }else{
            res.render("stores/index", {stores:allstores, currentUser: req.user});
        }
    })

        
});

router.post("/stores", isLoggedIn, function(req,res){

    var name = req.body.name;
    var image = req.body.image;   
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var desc =req.body.description;
    var newc = {name:name, image:image, description:desc, author:author};
    Store.create(newc, function(err,store){
        if(err){
            console.log(err);
            
        }else{
            res.redirect("/stores");
        }
    })

});

router.get("/stores/new", isLoggedIn, function(req,res){
    res.render("stores/new.ejs");
});

router.get("/stores/:id",function(req,res){
    Store.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
                 console.log(err);
        
   
    }else{
        console.log(found);

        res.render("stores/show", {store: found});
    }
    });
 
})

//edit
router.get("/stores/:id/edit", function(req, res) {
    Store.findById(req.params.id, function(err, foundStore){
        
        if(err){
            res.redirect("/stores");
           } else{
                res.render("stores/edit", {store: foundStore});
            }
        
    });

});


//update




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;