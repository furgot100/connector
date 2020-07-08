// Initialize express
const express = require('express')
const methodOverride = require('method-override')
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
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))


// INDEX
app.get('/', (req, res) => {
    models.Lobby.findAll({ order: [['createdAt', 'DESC']] }).then(lobbys => {
      res.render('home', { lobbys: lobbys });
    })
  })

// CREATE
app.post('/lobby', (req, res) => {
    models.Lobby.create(req.body).then(lobby => {
      res.redirect(`/lobby/${lobby.id}`);
    }).catch((err) => {
      console.log(err)
    });
})

// NEW
app.get('/lobby/new', (req, res) => {
    res.render('lobby-new', {});
})

app.get('/lobby/:id', (req, res) => {
    // Search for the event by its id that was passed in via req.params
    models.Lobby.findByPk(req.params.id).then((lobby) => {
      // If the id is for a valid event, show it
      res.render('lobby-show', { lobby: lobby })
    }).catch((err) => {
      // if they id was for an event not in our db, log an error
      console.log(err.message);
    })
})

// EDIT
app.get('/lobby/:id/edit', (req, res) => {
    models.Lobby.findByPk(req.params.id).then((lobby) => {
      res.render('lobby-edit', { lobby: lobby });
    }).catch((err) => {
      console.log(err.message);
    })
});

// UPDATE
app.put('/lobby/:id', (req, res) => {
    models.Lobby.findByPk(req.params.id).then(lobby => {
      lobby.update(req.body).then(lobby => {
        res.redirect(`/lobby/${req.params.id}`);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
});




// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})