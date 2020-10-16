// Initialize express
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const session = require('express-session')

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

const models = require('./db/models');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// Loads custom css
app.use(express.static('public'));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Passport initialization
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session());


// Routes
require('./controllers/lobby')(app, models);
require('./controllers/comment')(app, models);
require('./routes/user')(app, passport);

require('./db/config/passport/passport.js')(passport, models.User);






// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})