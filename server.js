var express = require("express");
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var todo = require('./routes/todo');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/', index);
//app.use('/expense', todo);

app.use(function(req, res, next){
    var err = new Error('Not found!');
    err.status = 404;
    next(err);
})

var server = app.listen(3000, function() {
    var host = 'localhost';
    var port = server.address().port;

    console.log("Listening on http://%s:%s/", host, port);
})
