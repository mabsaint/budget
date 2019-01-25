var mongojs = require('mongojs');
var date = require('date-and-time');
var mongodb = require('mongodb').MongoClient;
var assert = require('assert');
var uuid = require('uuid/v4');

const collectionName = 'entries';
const CALENDAR_FILTER = {
    date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth()),
        $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1)
    },
    type: 'expense'
};
var db = mongojs("mongodb://dbuser:dbuser123456@ds063178.mlab.com:63178/mongo_dpdev", [collectionName]);



module.exports = {
    /**
     * Creates a new entry
     * @param  {} item
     */
    newEntry: function (item) {
        if (!item.value || !(item.isCompleted + '')) {
            return null;
        } else {
            item.guid = uuid();
            return new Promise(function (resolve, reject) {
                if (item.period && item.date && item.enddate) {
                    var toInsert = [];
                    if (item.period == 'daily') { // Daily:
                        var date1 = new Date(item.date);
                        var date2 = new Date(item.enddate);

                        console.log(date.subtract(date2, date1).toDays());
                        var delta = date.subtract(date2, date1).toDays() + 1;

                        for (var i = 0; i < delta; i++) {
                            let tmp = JSON.parse(JSON.stringify(item));

                            tmp.date = date.addDays(date1, i);
                            tmp.enddate = date2;

                            console.log(tmp.date);

                            toInsert.push(tmp);
                            //console.log(JSON.stringify(toInsert));
                        }

                        console.log(JSON.stringify(toInsert));




                    } else if (item.period == 'weekly') { //weekly
                        var date1 = new Date(item.date);
                        var date2 = new Date(item.enddate);

                        console.log(date.subtract(date2, date1).toDays());
                        var delta = date.subtract(date2, date1).toDays() + 1;

                        for (var i = 0; i < delta; i += 7) {
                            let tmp = JSON.parse(JSON.stringify(item));

                            tmp.date = date.addDays(date1, i);
                            tmp.enddate = date1;

                            console.log(tmp.date);

                            toInsert.push(tmp);
                            //console.log(JSON.stringify(toInsert));
                        }

                        console.log(JSON.stringify(toInsert));

                    } else if (item.period == 'monthly') { //monthly
                        var date1 = new Date(item.date);
                        var date2 = new Date(item.enddate);
                        //var delta  = date.subtract(date2, date1).getMonth();
                        while (date1 < date2) {
                            let tmp = JSON.parse(JSON.stringify(item));
                            tmp.date = date1;
                            tmp.enddate = date1;

                            date1 = date.addMonths(date1, 1);

                            toInsert.push(tmp);
                        }
                    }

                    mongodb.connect("mongodb://dbuser:dbuser123456@ds063178.mlab.com:63178/mongo_dpdev", function (err, client) {
                        assert.equal(null, err);
                        console.log("Connected successfully.");
                        //var db = db.db('mongo_dpdev');
                        const collection = client.collection(collectionName);
                        collection.insertMany(toInsert, function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(result);
                                resolve(result);
                            }
                        })
                    });
                } else {
                    item.date = new Date(item.date)
                    db.entries.save(item, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }


            });
        }
    },


    /**
     * Retrieves all entries based on started date     * 
     * @param  {} start=null
     */
    getAll: function (start = null) {
        return new Promise(function (resolve, reject) {
            var filter = {};
            if (start) {
                var offset = new Date().getTimezoneOffset();
                var t = Date.parse(start) + (offset * 60000);
                start = new Date(t);
                filter.date = { $gte: new Date(start) };
            }
            console.log(filter);
            db[collectionName].find(filter).sort({ date: 1 }, function (err, result) {
                let ans = result.sort((a, b) => { a.date > b.date ? 1 : -1 });
                resolve(ans);
            });
        });
    },

    getEntries: function (start = null, end = null) {
        var filterObject = JSON.parse(JSON.stringify(CALENDAR_FILTER));
        if (start) {
            var offset = new Date().getTimezoneOffset();
            var t = Date.parse(start) + (offset * 60000);
            start = new Date(t);
            console.log(start);
        } else
            start = new Date(new Date().getFullYear(), new Date().getMonth());

        if (!end) end = new Date(new Date().getFullYear(), new Date().getMonth() + 1);

        if (start) {

            filterObject.date.$gte = new Date(start);
        }
        if (end) filterObject.date.$lte = new Date(end);

        return new Promise(function (resolve, reject) {
            db[collectionName].find(filterObject, function (err, result) {
                console.log(filterObject);
                resolve(result);
            });
        });
    },

    getIncomeEntries: function (start = null, end = null) {
        var filterObject = JSON.parse(JSON.stringify(CALENDAR_FILTER));
        filterObject.type = 'income'

        if (start) {
            var offset = new Date().getTimezoneOffset();
            var t = Date.parse(start) + (offset * 60000);
            start = new Date(t);
            console.log(start);
        } else
            start = new Date(new Date().getFullYear(), new Date().getMonth());
        if (!end) end = new Date(new Date().getFullYear(), new Date().getMonth() + 1);
        if (start) {
            filterObject.date.$gte = new Date(start);
        }
        if (end) filterObject.date.$lte = new Date(end);
        return new Promise(function (resolve, reject) {
            db[collectionName].find(filterObject, function (err, result) {
                // console.log(filterObject.date.$gte);
                resolve(result);
            });
        });
    },

    getGroupedEntries: function (start = null, end = null) {
        var filterObject = JSON.parse(JSON.stringify(CALENDAR_FILTER));

        if (start) {
            var offset = new Date().getTimezoneOffset();
            var t = Date.parse(start) + (offset * 60000);
            start = new Date(t);
            console.log(start);
        } else
            start = new Date(new Date().getFullYear(), new Date().getMonth());
        if (!end) end = new Date(new Date().getFullYear(), new Date().getMonth() + 1);

        if (start) {

            filterObject.date.$gte = new Date(start);
        }
        if (end) filterObject.date.$lte = new Date(end);

        return new Promise(function (resolve, reject) {
            var group = {
                key: { category: 1, guid: 1, type: 1 },
                cond: filterObject,
                reduce: function (curr, result) {
                    result.total += curr.value
                    result.date = curr.date
                },
                initial: { total: 0 },
                finalize: function (result) {
                    result.value = result.total
                }
            };
            db[collectionName].group(group, function (err, result) {
                if (err) reject(err);
                else resolve(result)
            })
        });
    },

    deleteEntry: function (id) {
        return new Promise(function (resolve, reject) {
            db[collectionName].remove({ "_id": db.ObjectId(id) }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    deleteEntryByGUID: function (guid) {
        return new Promise(function (resolve, reject) {
            db[collectionName].remove({ "guid": guid }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getIncomes: function (start = null, end = null) {
        var filterObject = JSON.parse(JSON.stringify(CALENDAR_FILTER));
        filterObject.type = 'income';

        if (start) {
            var offset = new Date().getTimezoneOffset();
            var t = Date.parse(start) + (offset * 60000);
            start = new Date(t);
            console.log(start);
        } else
            start = new Date(new Date().getFullYear(), new Date().getMonth());
        if (!end) end = new Date(new Date().getFullYear(), new Date().getMonth() + 1);
        if (start) {

            filterObject.date.$gte = new Date(start);
        }
        if (end) filterObject.date.$lte = new Date(end);
        return new Promise(function (resolve, reject) {
            db[collectionName].find(filterObject, function (err, result) {
                // console.log(filterObject.date.$gte);
                resolve(result);
            });
        });
    },

    getGroupedIncomes: function (start = null, end = null) {
        var filterObject = JSON.parse(JSON.stringify(CALENDAR_FILTER));
        filterObject.type = 'income'
        if (start) {
            var offset = new Date().getTimezoneOffset();
            var t = Date.parse(start) + (offset * 60000);
            start = new Date(t);
            console.log(start);
        } else
            start = new Date(new Date().getFullYear(), new Date().getMonth());
        if (!end) end = new Date(new Date().getFullYear(), new Date().getMonth() + 1);
        if (start) {

            filterObject.date.$gte = new Date(start);
        }
        if (end) filterObject.date.$lte = new Date(end);

        return new Promise(function (resolve, reject) {
            var group = {
                key: { category: 1, guid: 1 },
                cond: filterObject,
                reduce: function (curr, result) {
                    result.total += curr.value
                    result.date = curr.date
                },
                initial: { total: 0 },
                finalize: function (result) {
                    result.value = result.total
                }
            };
            db[collectionName].group(group, function (err, result) {
                if (err) reject(err);
                else resolve(result)
            })
        });
    },

    // #region Accounts
    getAccounts: function () {
        return new Promise(function (resolve, reject) {
            db.accounts.find({}, function (error, data) {
                if (error) reject(error);
                else resolve(data);
            })
        })
    },

    newAccount: function (item) {
        return new Promise(function (resolve, reject) {
            let tmp = JSON.parse(JSON.stringify(item));
            if(item._id) {
                let id = item._id;
                delete item._id;
                db.accounts.update({ "_id": db.ObjectId(id) }, item,{},function (error, data) {
                    if (error) reject(error);
                    else {
                        db.accounts.find({}, function (error, data) {
                            if (error) reject(error);
                            else resolve(data);
                        })
                    }
                })
            } else {
                db.accounts.save(item, function (error, data) {
                    if (error) reject(error);
                    else {
                        db.accounts.find({}, function (error, data) {
                            if (error) reject(error);
                            else resolve(data);
                        })
                    }
                })
            }
           
        })
    },

    updateAccount: function (item) {

    },

    deleteAccount: function (item) {

    }

    // #endregion

}