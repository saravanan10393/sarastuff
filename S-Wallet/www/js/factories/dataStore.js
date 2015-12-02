angular.module("SWallet.factories").factory("Storage", ['$cordovaSQLite', '$filter', '$q', function ($cordovaSQLite, $filter, $q) {

    var storage = {
        allExpences: [],
        ammount: {
            budjectAmt: 0,
            remainingAmt: 0,
            spentAmt: 0
        },
        readOnlyMode: false,
        currentViewMonth: $filter('date')(new Date(), 'MM/yyyy')
    };

    if (localStorage.getItem($filter('date')(new Date(), 'MM/yyyy')) && localStorage.getItem($filter('date')(new Date(), 'MM/yyyy')).length > 0) {
        storage.ammount.budjectAmt = parseInt(localStorage.getItem($filter('date')(new Date(), 'MM/yyyy')));
    }

    storage.db = null;

    storage.addExpence = function (expence) {
        var deferd = $q.defer();
        var todayExpence = _.findWhere(storage.allExpences, {
                date: expence.date
            }),
            query;
        if (todayExpence) {
            todayExpence.expences.push(expence);
            query = "UPDATE expences SET expences = '" + JSON.stringify(todayExpence.expences) + "' WHERE date = '" + todayExpence.date + "'";
            $cordovaSQLite.execute(storage.db, query).then(function (res) {
                deferd.resolve();
                console.log("update ID -> " + res);
            }, function (err) {
                deferd.reject();
                console.error(err);
            });
        } else {
            var temp = [];
            temp.push(expence);
            storage.allExpences.push({
                date: expence.date,
                expences: temp
            });
            query = "INSERT INTO expences (date,expences) VALUES (?,?)";
            $cordovaSQLite.execute(storage.db, query, [expence.date, JSON.stringify(temp)]).then(function (res) {
                console.log("INSERT ID -> " + res.insertId);
                deferd.resolve();
            }, function (err) {
                deferd.reject()
                console.error(err);
            });
        }
        return deferd.promise;
    }

    storage.updateExpence = function (date, exp) {
        var expence = _.findWhere(storage.allExpences, {
                date: date
            }),
            query, temp;
        temp = _.findWhere(expence.expences, {
            id: exp.id
        });
        temp = exp;
        query = "UPDATE expences SET expences = '" + JSON.stringify(expence.expences) + "' WHERE date = '" + expence.date + "'";
        $cordovaSQLite.execute(storage.db, query).then(function (res) {
            console.log("update ID -> " + res);
        }, function (err) {
            console.error(err);
        });
    }

    storage.deleteExpence = function (date, expId) {
        var expence = _.findWhere(storage.allExpences, {
                date: date
            }),
            query;
        expence.expences.splice(_.findIndex(expence.expences, {
            id: expId
        }), 1);
        if (expence.expences.length == 0) {
            query = "DELETE FROM expences WHERE date = '" + expence.date + "'";
            storage.allExpences.splice(_.findIndex(storage.allExpences, {
                date: date
            }), 1);
        } else {
            query = "UPDATE expences SET expences = '" + JSON.stringify(expence.expences) + "' WHERE date = '" + expence.date + "'";
        }
        $cordovaSQLite.execute(storage.db, query).then(function (res) {
            console.log("update ID -> " + res);
        }, function (err) {
            console.error(err);
        });
    }

    storage.deleteAllDayExpence = function (expDate) {
        var query = "DELETE FROM expences WHERE date = '" + expDate + "'";
        storage.allExpences.splice(_.findIndex(storage.allExpences, {
            date: expDate
        }), 1);
        $cordovaSQLite.execute(storage.db, query).then(function (res) {
            console.log("update ID -> " + res);
        }, function (err) {
            console.error(err);
        });
    }

    storage.deleteMonthlyExpence = function (month, year) {
        var deferd = $q.defer(),
            date = new Date(),
            fromYear = year || date.getFullYear(),
            fromMonth = month || date.getMonth(),
            firstDay = $filter('date')(new Date(fromYear, fromMonth, 1), "dd/MM/yyyy"),
            lastDay = $filter('date')(new Date(fromYear, fromMonth + 1, 0), "dd/MM/yyyy");
        console.log("first day and last day ", firstDay, lastDay);
        var query = "DELETE FROM expences WHERE date BETWEEN '" + firstDay + "' AND '" + lastDay + "'";
        $cordovaSQLite.execute(storage.db, query, []).then(function (res) {
            storage.getAllExpences();
            deferd.resolve();
        }, function (err) {
            deferd.reject();
            console.error('deleteMonthlyExpence error ', err);
        });
        return deferd.promise;
    }

    storage.getAllExpences = function (month, year) {
        var deferd = $q.defer(),
            date = new Date(),
            fromYear = year || date.getFullYear(),
            fromMonth = month || date.getMonth(),
            firstDay = $filter('date')(new Date(fromYear, fromMonth, 1), "dd/MM/yyyy"),
            lastDay = $filter('date')(new Date(fromYear, fromMonth + 1, 0), "dd/MM/yyyy");
        console.log("first day and last day ", firstDay, lastDay);
        var query = "SELECT * FROM expences WHERE date BETWEEN '" + firstDay + "' AND '" + lastDay + "'";
        $cordovaSQLite.execute(storage.db, query, []).then(function (res) {
            if (res.rows.length > 0) {
                storage.allExpences.length = 0;
                _.each(res.rows, function (data, i) {
                    storage.allExpences.push({
                        date: res.rows.item(i).date,
                        expences: JSON.parse(res.rows.item(i).expences || "[]")
                    });
                });
                console.log("feteched all expences ", storage.allExpences);
                deferd.resolve();
            } else {
                console.log("No results found");
            }
        }, function (err) {
            deferd.reject();
            console.error('getAllExpences error ', err);
        });
        return deferd.promise;
    }

    storage.deleteAllExpence = function () {
        var query = "DELETE FROM expences";
        $cordovaSQLite.execute(storage.db, query).then(function (res) {
            if (res) {
                console.log("deleted all expences ", res.rows);
                storage.allExpences.length = 0;
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error('deleteAllExpences error ', err);
        });
    }

    return storage;
}]);
