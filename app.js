// Initialize express
const express = require('express')
const app = express()

// require handlebars
const exphbs = require('express-handlebars');
// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// Use handlebars to render
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));


var events = [
    { title: "I am your first event", desc: "A great event that is super fun to look at and good"},
    { title: "I am your second event", desc: "A great event that is super fun to look at and good"},
    { title: "I am your third event", desc: "A great event that is super fun to look at and good"}
]

// INDEX
app.get('/', (req, res) => {
    res.render('home', { events: events });
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