var passport = require("../db/config/passport/passport.js");
var path = require("path");
var db = require("../db/models");

module.exports = function (app, passport) {
    //REGISTER
    app.get('/signup', (req, res) => {
        res.render('new-user');
    })

    app.get('/login' ,(req, res) => {
        res.render('login');
    })

    app.get("/logout", (req, res) => {
        console.log("Log Out Route Hit");
        req.session.destroy(function(err) {
            if (err) console.log(err)
                res.redirect('/')
        })
    })

    app.post('/signup/newuser', passport.authenticate('local-signup'), function (req, res) {
        console.log(req.user);
        res.render('home');
    });

    app.post("/login/user",passport.authenticate('local-signin'), (req,res) => {
        console.log(req.user);
        res.render('home');
   });

   function isLoggedIn (req, res, next){
       if (req.isAuthenticated())
            return next()
        res.redirect('signup');
   };


}