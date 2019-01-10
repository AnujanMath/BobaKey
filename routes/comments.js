var express = require("express");
var router = express.Router();
var Store = require("../models/store");
var Comment = require("../models/comment");

router.get("/stores/:id/comments/new", isLoggedIn,  function(req, res){
    Store.findById(req.params.id, function(err, store){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {store: store});
        }
    })
});

router.post("/stores/:id/comments", isLoggedIn, function(req, res){
   //lookup  using ID
   Store.findById(req.params.id, function(err, store){
       if(err){
           console.log(err);
           res.redirect("/stores");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               store.comments.push(comment);
               store.save();
               res.redirect('/stores/' + store._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to 
   //redirect  show page
});
module.exports = router;
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}