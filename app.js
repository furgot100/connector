// Initialize express
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const models = require('./db/models');

const passport = require('passport')
const Strategy = require('passport-local').Strategy


// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const exphbs = require('express-handlebars')
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(handlebars),
});

// Use "main" as our default layout
app.engine('handlebars', hbs.engine);
// Use handlebars to render
app.set('view engine', 'handlebars');
// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));

// const models = require('./db/models');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

app.use(express.static('public'));

// app.use(passport.initialize());
// app.use(passport.session());

passport.use(new Strategy(
  function(username, password, cb) {
    models.User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}))

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());


require('./controllers/lobby')(app, models);
require('./controllers/comment')(app, models);
require('./controllers/user')(app,models);






// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})