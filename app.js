// Initialize express
const express = require('express')
const methodOverride = require('method-override')
const app = express()

// PASSPORT NEED MODULES
const crypto = require('crypto');
const mysql = require('mysql')
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// MYSQL connection and instantiate the session store
var connection = mysql.createConnection({
  host: process.env.SESSIONSDB_HOST,
  port: process.env.SESSIONSDB_PORT,
  user: process.env.SESSIONSDB_USER,
  password: process.env.SESSIONSDB_PASS,
  database: process.env.SESSIONSDB_DB
});

var sessionStore = new MySQLStore({
  checkExpirationInterval: parseInt(process.env.SESSIONSDB_CHECK_EXP_INTERVAL, 10),
  expiration: parseInt(process.env.SESSIONSDB_EXPIRATION, 10)
}, connection);

// Session middleware 
/* Create a cookie that expires in 1 day */
var expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSIONSDB_SECRET,
  store: sessionStore,
  cookie: { expires: expireDate }
}));


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

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

// require('./controllers/auth.js')(app);
require('./controllers/lobby')(app, models);
require('./controllers/comment')(app, models);







// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})