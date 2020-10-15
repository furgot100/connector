module.exports = function (app, models) {
    //REGISTER
    app.get('/register', (req, res) => {
        res.render('new-user', {});
    })

    app.get('/login' ,(req, res) => {
        res.render('login', {});
    })


}