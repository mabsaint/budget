var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs("mongodb://dbuser:parola141999!@ds063178.mlab.com:63178/mongo_dpdev", ['budget'])

/* Get All Items */
router.get('/expense', function(req, res, next) {
    var items = db.budget.find(function(err, items) {
        if(err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
})
/* POST/SAVE an Item */
router.post('/expense', function(req, res, next){
    var item = req.body;

    if(!item.value || !(item.isCompleted + '')) {
        res.status(400);
        res.json({
            "error":"Invalid data"
        });
    } else {
        db.budget.save(item, function(err, result){
            if(err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
    
})