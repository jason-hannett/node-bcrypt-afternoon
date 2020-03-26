require('dotenv').config();
    const express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
    authCtrl = require('../server/controllers/authController'),
    treasureCtrl = require('./controllers/treasureController'),
    auth = require('./middleware/authMiddleware'),
    port = SERVER_PORT,
    app = express();

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cooke: {maxAge: 1000 * 60 * 60 * 24}
}))

    massive({
        connectionString: CONNECTION_STRING,
        ssl: {rejectUnauthorized: false}
    }).then(db => {
        app.set('db', db);
        console.log('db is connected')
    })

    app.post('/api/auth/register', authCtrl.register);
    app.post('/auth/login', authCtrl.login);
    app.get('/auth/logout', authCtrl.logout);

    app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
    app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
    app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
    app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(port, () => console.log(`Server running on ${port}`));