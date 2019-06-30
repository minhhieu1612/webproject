var express = require('express');
var router = express.Router();
var user_md = require('../models/users');
var post_md = require('../models/post')
var helper = require('../helpers/helper');
router.get('/', function (req, res) {
    if (req.session.user) {
        var data = post_md.getAllPost();
        data.then(function (posts) {
            var data = {
                posts: posts,
                error: false
            };
            res.render('admin/dashboard', { data: data });
        }).catch(function (err) {
            res.render('admin/dashboard', { data: { error: "get post data is error" } });
        });

    } else {
        res.redirect('/admin/signin');
    }

    //res.json({'message':'this is admin page'});
});
router.get('/signup', function (req, res) {
    res.render('signup', { data: {} });
});
router.post('/signup', function (req, res) {
    var user = req.body;
    if (user.email.trim().length == 0) {
        res.render('signup', { data: { error: 'emai is required' } });
    }
    if (user.passwd != user.repasswd && user.passwd.trim().length != 0) {
        res.render('signup', { data: { error: 'password is not match' } });
    }
    //insert db
    var password = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname
    }
    var result = user_md.addUser(user);
    result.then(function (data) {
        res.redirect('/admin/signin');
    }).catch(function (err) {
        res.render('signup', { data: { error: 'could not insert user data to DB' } });
    });
    //if(!result){
    // res.render('signup', {data:{error: 'could not insert user data to DB'}});
    //}else{
    // res.json({message:'insert success'})

    // }
});
router.get('/signin', function (req, res) {
    res.render('signin', { data: {} });
});
router.post('/signin', function (req, res) {
    var parmas = req.body;
    if (parmas.email.trim().length == 0) {
        res.render('signin', { data: { error: 'please enter an email' } });
    } else {
        var data = user_md.getUserByEmail(parmas.email);
        if (data) {
            data.then(function (users) {
                var user = users[0];
                var status = helper.compare_password(parmas.password, user.password);
                console.log(parmas.password);
                console.log(user.password);
                console.log(!status);
                if (status) {
                    res.render('signin', { data: { error: 'password wrong ' } });
                } else {
                    req.session.user = user;
                    res.redirect('/admin/');
                }
            });
        } else {
            res.render('signin', { data: { error: 'user not exist' } });

        }
    }
});
router.get('/post/new', function (req, res) {
    if (req.session.user) {
        res.render('admin/post/new', { data: { error: false } });
    } else {
        res.redirect('/admin/signin');
    }

});
router.post('/post/new', function (req, res) {
    var params = req.body;
    if (params.Title.trim().length == 0) {
        var data = {
            error: 'please enter a title'
        };
        res.render('admin/post/new', { data: data });
    } else {
        var now = new Date();
        params.create_at = now;
        params.update_at = now;
        var data = post_md.addPost(params);
        data.then(function (result) {
            res.redirect('/admin');
        }).catch(function (err) {
            var data = {
                error: 'could not insert posts'
            };
            res.render('admin/post/new', { data: data });
        });
    }

});
router.get('/post/edit:id', function (req, res) {
    if (req.session.user) {
        var params = req.params;
        var id = params.id;
        var data = post_md.getPostByID(id);
        if (data) {
            data.then(function (posts) {
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                };
                res.render('admin/post/edit', { data: data });
            }).catch(function (err) {
                var data = {
                    error: 'could not get post by ID'
                };
                res.render('admin/post/edit', { data: data });
            });
        } else {
            var data = {
                error: 'could not get post by ID'
            };
            res.render('admin/post/edit', { data: data });
        }
    } else {
        res.redirect('/admin/signin');
    }

});
router.put('/post/edit', function (req, res) {
    var params = req.body;
    data = post_md.updatePost(params);
    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        });
    }
});
router.delete('/post/delete', function (req, res) {
    var post_id = req.body.id;
    console.log(post_id);
    var data = post_md.deletePost(post_id);
    console.log(data);
    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        });
    }
});
router.get('/post', function (req, res) {
    if (req.session.user) {
        res.redirect('/admin');
    } else {
        res.redirect('/admin/signin');
    }

});
router.get('/user', function (req, res) {
    if (req.session.user) {
        var data = user_md.getAllUser();
        data.then(function (users) {
            var data = {
                users: users,
                error: false
            }
            res.render('admin/user', { data: data });
        }).catch(function (err) {
            var data = {
                error: 'could not get user info'
            }
            res.render('admin/user', { data: data });
        });
    } else {
        res.redirect('/admin/signin');
    }

});
module.exports = router;
