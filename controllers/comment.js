module.exports = (app, models) => {
    // NEW
    app.get('/lobby/:lobbyId/comment/new', (req, res) => {
      models.Lobby.findByPk(req.params.eventId).then(lobby => {
        res.render('lobby-show', { lobby: lobby });
      });
    });
  
    // CREATE
    app.post('/lobby/:lobbyId/comment', (req, res) => {
        req.body.LobbyId = req.params.lobbyId;
        models.Comment.create(req.body).then(comment => {
            res.redirect(`/lobby/${req.params.lobbyId}`);
        }).catch((err) => {
            console.log(err)
        });
    });
  
    // DESTROY  
}