var express = require("express");
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var todo = require('./routes/todo');

var app = express();

app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Setup CORS:
const cors = require('cors');
const whitelist = ['http://mybudget.website', 'http://localhost:4200'];

var corsOptions = {
    origin: whitelist,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

/*
app.use('/', index);
app.use('/expense', todo);
*/
var mongoservice = require('./mongo.service');

// Routing:
app.route('/expense')
    .get(function (req, res) {
        mongoservice.getEntries()
            .then(function (result) {
                res.send(result);
            });
    })
    .post(function (req, res) {
        var item = req.body;
        item.type = 'expense';
        item.value *= -1;
        //console.log(req.body);
        mongoservice.newEntry(item)
            // .then(function(item2){
            //     mongoservice.checkCategory
            // })
            .then(function (result) {
                res.send(result);
            });

    });

app.route('/expense/:start/:end')
    .get(function (req, res) {
        mongoservice.getEntries(req.params.start, req.params.end)
            .then(function (result) {
                res.send(result);
            });
    })

app.route('/expense/grouped')
    .get(function (req, res) {
        mongoservice.getGroupedEntries()
            .then(function (result) {
                res.send(result);
            })
    });

app.route('/expense/grouped/:start/:end')
    .get(function (req, res) {
        mongoservice.getGroupedEntries(req.params.start, req.params.end)
            .then(function (result) {
                res.send(result);
            })
    });

app.route('/expense/deleteguid/:guid')
    .get(function (req, res) {
        res.send(req.params.guid);
    })
    .put(function (req, res) {
        mongoservice.deleteEntryByGUID(req.params.guid)
            .then(function (result) {
                res.send(result)
            })
    });

app.route('/expense/delete/:guid')
    .get(function (req, res) {
        res.send(req.params.guid);
    })
    .put(function (req, res) {
        mongoservice.deleteEntry(req.params.guid)
            .then(function (result) {
                res.send(result)
            })
});

app.route('/income')
    .get(function (req, res) {
        mongoservice.getIncomeEntries()
            .then(function (result) {
                res.send(result);
            });
    })
    .post(function (req, res) {
        var item = req.body;
        item.type = 'income';
        //console.log(req.body);
        mongoservice.newEntry(item)
            .then(function (result) {
                res.send(result);
            });

    });

    app.route('/income/:start/:end')
    .get(function (req, res) {
        mongoservice.getIncomeEntries(req.params.start, req.params.end)
            .then(function (result) {
                res.send(result);
            });
    })
    .post(function (req, res) {
        var item = req.body;
        item.type = 'income';
        //console.log(req.body);
        mongoservice.newEntry(item)
            .then(function (result) {
                res.send(result);
            });

    });

app.route('/income/grouped')
    .get(function (req, res) {
        mongoservice.getGroupedIncomes()
            .then(function (result) {
                res.send(result);
            });
    })

app.route('/income/grouped/:start/:end')
    .get(function (req, res) {
        mongoservice.getGroupedIncomes(req.params.start, req.params.end)
            .then(function (result) {
                res.send(result);
            })
    });

app.route('/all')
    .get(function(req, res){
        mongoservice.getAll()
        .then(function (result) {
            res.send(result);
        })
    })

app.route('/all/:start')
    .get(function(req, res){
        mongoservice.getAll(req.params.start)
        .then(function (result) {
            res.send(result);
        })
    })

app.route('/allmonth')
    .get(function(req, res){
        mongoservice.getAllThisMonth()
        .then(function (result) {
           // var ans = result.reduce((a,b) => a + b['value'], 0)
            res.send(result);
        })
    })

/** Accounts */
app.route('/accounts')
    .get(function(req, res){
        mongoservice.getAccounts()
        .then(function(data){
            res.send(data);
        })
    })
    .post(function(req, res){
        var body = req.body;
        mongoservice.newAccount(body)
        .then(function(data){
            res.send(data);
        })
    })

    app.route('/categories')
    .get(function(req, res){
        mongoservice.getExpenseCategories()
        .then(function(data){
            res.send(data)
        })
    })
    .post(function(req, res){

    })

    app.route('/grouped')
    .get(function(req, res){
        mongoservice.groupedByCategory()
        .then(function(data){
           let answer = [];
           data.forEach(element => {
              answer.push({name: element._id, y: element.total * (-1)}) 
           });
            res.send(answer)
        })
    })

    app.route('/grouped/:start')
    .get(function(req, res){
        mongoservice.groupedByCategory(req.params.start)
        .then(function(data){
           let answer = [];
           data.forEach(element => {
              answer.push({name: element._id, y: element.total * (-1)}) 
           });
            res.send(answer)
        })
    })

    app.route('/logininfo')
    .get(function(request, response){
        mongoservice.getLoginInfo()
        .then(function(data) {
            response.send(data)
        })
    })

app.use(function (req, res, next) {
    var err = new Error('Not found!');
    err.status = 404;
    next(err);
})

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = server.address().port;

    console.log("Listening on http://%s:%s/", host, port);
})
