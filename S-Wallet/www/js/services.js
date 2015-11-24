angular.module('SWallet.services', [])

.factory('Storage', ['$cordovaSQLite', function ($cordovaSQLite) {

    var storage = {
        allExpences: []
    };
    storage.db = null;

    storage.addExpence = function (expence) {
        var todayExpence = _.findWhere(storage.allExpences, {
                date: expence.date
            }),
            query;
        if (todayExpence) {
            todayExpence.expences.push(expence);
            query = "UPDATE expences SET expences = " + JSON.stringify(todayExpence.expences) + " WHERE date = " + todayExpence.date;
            $cordovaSQLite.execute(storage.db, query).then(function (res) {
                console.log("update ID -> " + res);
            }, function (err) {
                console.error(err);
            });
        } else {
            storage.allExpences.push({
                date: expence.date,
                expences: [].push(expence)
            });
            query = "INSERT INTO expences (date, expences) VALUES (?,?)";
            $cordovaSQLite.execute(storage.db, query, [expence.date, JSON.stringify(expence.expecnes)]).then(function (res) {
                console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        }
    }

    storage.getAllExpences = function () {
        var query = "SELECT * FROM expences";
        $cordovaSQLite.execute(storage.db, query, []).then(function (res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).date + " " + res.rows.item(0).expences);
                console.log("feteched all expences ", res.rows);
                storage.allExpences = res.rows;
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error('getAllExpences error ', err);
        });
    }



    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
  }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
  }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
  }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
  }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
  }];

    return storage;
}]);