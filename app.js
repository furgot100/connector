// Initialize express
const express = require('express')
const app = express()

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

var lobbys = [
    { title: "I am your first event", desc: "A great event that is super fun to look at and good"},
    { title: "I am your second event", desc: "A great event that is super fun to look at and good"},
    { title: "I am your third event", desc: "A great event that is super fun to look at and good"}
]

// INDEX
app.get('/', (req, res) => {
    models.Lobby.findAll().then(lobbys => {
      res.render('home', { lobbys: lobbys });
    })
  })

// CREATE
app.post('/lobby', (req, res) => {
    models.Lobby.create(req.body).then(lobby => {
      res.redirect(`/`);
    }).catch((err) => {
      console.log(err)
    });
})

// NEW
app.get('/lobby/new', (req, res) => {
    res.render('lobby-new', {});
})


// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})