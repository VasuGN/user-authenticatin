const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { httpMethod } = require('./src/utils/logger')
const logger = require('morgan');
const { badRequest404 } = require('./src/middlewares/response');

//set env path
require('dotenv').config();

const app = express();

//establish global connection
const db = require('./src/config/database');
db.getPool()

//Middleware to log HTTP requests
app.use(httpMethod);

app.use(logger('dev'));
app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({ origin: "*", credentials: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Pragma", "no-cache");
    res.header('Access-Control-Allow-Methods', "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

// Root route of express app
app.get("/", (req, res) => {
    res.send("Welcome to User Application");
});

//api calls to main router
const routeApis = require('./src/routes/routes')
app.use(routeApis);

// catch 404 and forward to error handler
app.use(async function (req, res, next) {
    next(await badRequest404())
});

// error handler
app.use(function (err, req, res, next) {
    let statusCode = 500;
    if (err['error'].code == 'NOT_FOUND') {
        statusCode = 404
    }
    res.status(statusCode).json(err)
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!')
});

module.exports = app;