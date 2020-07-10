module.exports = function (app, models) {
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

    //SHOW
    app.get('/lobby/:id', (req, res) => {
        // Search for the event by its id that was passed in via req.params
        models.Lobby.findByPk(req.params.id, { include: [{model: models.Comment }] }).then((lobby) => {
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

    // DELETE
    app.delete('/lobby/:id', (req, res) => {
        models.Lobby.findByPk(req.params.id).then(lobby => {
        lobby.destroy();
        res.redirect(`/`);
        }).catch((err) => {
        console.log(err);
        });
    })
}