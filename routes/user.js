module.exports = function (app, models, passport) {
    var Auth = models.User



    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(
        
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback

        }, function (req, email, password, done) {
            console.log("Signup for - ", email)
            var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

            }
            Auth.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                //console.log(user);
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };

                    Auth.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }

                    });
                    }
            });
        }
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
           
        {
            // by default, local strategy uses username and password, we will override with email

            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true // allows us to pass back the entire request to the callback

        },


        function (req, email, password, done) {

            var Auth = auth;

            var isValidPassword = function (userpass, password) {

                return bCrypt.compareSync(password, userpass);

            }
            console.log("logged to", email)
            Auth.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                console.log(user)
                if (!user) {

                    return done(null, false, {
                        message: 'Email does not exist'
                    });

                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false, {
                        message: 'Incorrect password.'
                    });

                }


                var userinfo = user.get();
                return done(null, userinfo);


            }).catch(function (err) {

                console.log("Error:", err);

                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });

            });


        }

    ));

    //serialize
    passport.serializeUser(function (auth, done) {

        done(null, auth.id);

    });

    // deserialize user 
    passport.deserializeUser(function (id, done) {

        Auth.findById(id).then(function (user) {

            if (user) {

                done(null, user.get());

            } else {

                done(user.errors, null);

            }

        });

    });
    
    
    
    
    
    
    //REGISTER
    app.get('/signup', (req, res) => {
        res.render('new-user', {});
    })

    app.get('/login' ,(req, res) => {
        res.render('login', {});
    })

    app.get("/logout", (req, res) => {
        req.session.destroy(function(err) {
            if (err) console.log(err)
                res.redirect('/')
        })
    })

    app.post('/signup/newuser', passport.authenticate('local-signup'), (req, res) => {
        // console.log(req.user);
        res.render('homepage');
    });

    app.post("/login/user",passport.authenticate('local-signin'), (req,res) => {
        // console.log(req.user);
        res.render('homepage');
   });

   function isLoggedIn (req, res, next){
       if (req.isAuthenticated())
            return next()
        res.redirect('signup');
   };


}