var express = require('express');
var router=express.Router();
var post_md=require('../models/post');
router.get('/',function(req,res){
    var data =post_md.getAllPost();
    data.then(function(posts){
        var result={
            posts:posts,
            error: false
            
        };
        res.render('blog/index',{data:result});
    }).catch(function(err){
        var result={
            error:"could not get post data"
        };
        res.render('blog/index',{data:result});
    });
    //res.render('blog/index');
    //res.json({'message':'this is blog page'});
});
router.get('/post/:id',function(req,res){
    var data=post_md.getPostByID(req.params.id);
    data.then(function(posts){
        var post=posts[0];
        var result={
            post:post,
            error:false
        };
        res.render('blog/post',{data:result});
    }).catch(function(err){
        var result={
            error:"could not get post detail"        
        };
        res.render('blog/post',{data:result});
    });
});
router.get('/about',function(req,res){
    res.render('blog/about');
})
module.exports=router;