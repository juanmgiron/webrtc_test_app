const express = require('express')
const cors = require('cors')
const OpenTok = require("opentok")
const mysql = require('mysql')
require('dotenv').config()

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET

const app = express()
const opentok = new OpenTok(apiKey, apiSecret)
const port = 8080

app.options('*', cors())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json())

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: ''
})

db.connect(function(err) {
    if (err) throw err
    console.log('db connected')
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/createSession', (req, res) => {
    opentok.createSession(function (err, session) {
        if (err) return console.log(err);
        db.query('INSERT INTO session (sessionId, name) VALUES ("'+session.sessionId+'", "'+req.body.name+'")', (error, results, fields) => {
            if (error) throw error;
            res.send(session.sessionId)
        })
    });
})

app.get('/sessions', (req, res) => {
    db.query('SELECT * FROM session', (error, results, fields) => {
        if (error) throw error;
        results = JSON.parse(JSON.stringify(results));
        res.send(results)
    })
})

app.post('/token', (req, res) => {
    token = opentok.generateToken(req.body.id)
    const results = {
        token,
        key: apiKey
    }
    res.send(results)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})